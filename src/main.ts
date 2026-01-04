import {Editor, MarkdownView, Notice, Plugin, requestUrl} from 'obsidian';
import TurndownService from 'turndown';
import {DEFAULT_SETTINGS, WikiOTDPluginSettings, WikiOTDSettingTab} from "./settings";

export default class WikiOTDPlugin extends Plugin {
	settings: WikiOTDPluginSettings;

	private wikipediaTitleForDate(date: Date): string {
		const timeZone =
			this.settings.timeZoneMode === "manual"
				? this.settings.manualTimeZone
				: undefined;
	
		const parts = new Intl.DateTimeFormat("en-US", {
			month: "long",
			day: "numeric",
			...(timeZone ? { timeZone } : {})
		}).formatToParts(date);
	
		const month = parts.find(p => p.type === "month")?.value ?? "";
		const day = parts.find(p => p.type === "day")?.value ?? "";
	
		return `${month}_${day}`;
	}

	private async insertTodayIntoActiveEditor(editor: Editor): Promise<void> {
		const md = await this.fetchOnThisDayMarkdown(new Date());
		editor.replaceSelection(md + '\n');
	}

	private async fetchOnThisDayMarkdown(date: Date): Promise<string> {
		type MediaWikiParseResponse = {
			parse?: { text?: string };
		};

		const title = this.wikipediaTitleForDate(date);

		// MediaWiki Action API: parse page -> HTML
		const url =
			`https://en.wikipedia.org/w/api.php` +
			`?action=parse&format=json&formatversion=2&redirects=1` +
			`&prop=text&page=${encodeURIComponent(title)}`;

		const res = await requestUrl({
			url,
			headers: {
				// Wikimedia recommends a descriptive UA for API clients
				'User-Agent': 'Obsidian-WikiOTDPlugin/0.1 (local)'
			}
		});

		const json = res.json as MediaWikiParseResponse;
		const html = json.parse?.text;
		if (!html) throw new Error('Unexpected API response');

		const sectionsHtml = this.extractWikipediaSectionsHtml(html, ['Events', 'Births', 'Deaths']);

		const turndown = new TurndownService({
			headingStyle: 'atx',
			bulletListMarker: '-'
		});

		// citations like [1]
		turndown.remove(['sup']);

		const bodyMd = turndown.turndown(sectionsHtml).trim();

		const niceTitle = title.replace('_', ' ');
		return `## ${niceTitle}\n\n${bodyMd}`;
	}

	private extractWikipediaSectionsHtml(html: string, sectionIds: string[]): string {
		const doc = new DOMParser().parseFromString(html, "text/html");
		const container = doc.body;

		// Remove common noise that still sneaks into extracted sections
		container.querySelectorAll(
			'.mw-editsection, .reference, .reflist, .navbox, .metadata, .ambox, .shortdescription, #toc'
		).forEach(el => el.remove());

		const out = document.createElement('div');

		for (const id of sectionIds) {
			const headline = container.querySelector(`#${CSS.escape(id)}`);
			const h2 = headline?.closest('h2');
			if (!h2) continue;

			// MediaWiki sometimes wraps headings like: <div class="mw-heading ..."><h2>...</h2></div>
			const start = h2.parentElement?.classList.contains('mw-heading') ? h2.parentElement : h2;

			// Add a clean heading for the section
			const heading = document.createElement('h2');
			heading.textContent = id;
			out.appendChild(heading);

			// Copy siblings until the next section heading
			let el = start.nextElementSibling;
			while (el) {
				// Stop at the next section heading (either direct <h2> or a mw-heading wrapper)
				if (el.tagName.toLowerCase() === 'h2') break;
				if (el.classList.contains('mw-heading') && el.querySelector('h2')) break;

				out.appendChild(el.cloneNode(true));
				el = el.nextElementSibling;
			}
		}

		// Rewrite relative Wikipedia links to absolute
		out.querySelectorAll<HTMLAnchorElement>('a[href^="/wiki/"]').forEach(a => {
			a.href = `https://en.wikipedia.org${a.getAttribute('href')}`;
		});

		// Fallback: if nothing matched, return original (so it still inserts something)
		return out.innerHTML.trim() || container.innerHTML;
	}

	async onload() {
		await this.loadSettings();

		// Ribbon icon: inserts into the active markdown note
		this.addRibbonIcon('calendar-clock', 'On this day in history', async () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) {
				new Notice('No active note');
				return;
			}

			try {
				new Notice('Retrieving today\'s information.');
				await this.insertTodayIntoActiveEditor(view.editor);
				new Notice('Inserted.');
			} catch (err) {
				console.error(err);
				new Notice('Could not retrieve today\'s information.');
			}
		});

		this.addCommand({
			id: 'insert-wiki-on-this-day',
			name: 'Insert today\'s events from history.',
			editorCallback: async (editor: Editor) => {
				try {
					new Notice('Retrieving today\'s information.');
					await this.insertTodayIntoActiveEditor(editor);
					new Notice('Inserted.');
				} catch (err) {
					console.error(err);
					new Notice('Failed to retrieve today\'s information.');
				}
			}
		});

		// Settings
		this.addSettingTab(new WikiOTDSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<WikiOTDPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
