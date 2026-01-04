import { App, PluginSettingTab, Setting } from "obsidian";
import WikiOTDPlugin from "./main";

export type TimeZoneMode = "auto" | "manual";

export interface WikiOTDPluginSettings {
	timeZoneMode: TimeZoneMode;
	manualTimeZone: string;
}

export const DEFAULT_SETTINGS: WikiOTDPluginSettings = {
	timeZoneMode: "auto",
	manualTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
};

const TIME_ZONES: string[] = [
	"UTC",

	// North America
	"America/Los_Angeles",
	"America/Denver",
	"America/Chicago",
	"America/New_York",
	"America/Phoenix",
	"America/Anchorage",
	"Pacific/Honolulu",
	"America/Toronto",
	"America/Vancouver",
	"America/Mexico_City",

	// South America
	"America/Sao_Paulo",
	"America/Argentina/Buenos_Aires",
	"America/Santiago",

	// Europe
	"Europe/London",
	"Europe/Dublin",
	"Europe/Paris",
	"Europe/Berlin",
	"Europe/Rome",
	"Europe/Madrid",
	"Europe/Stockholm",
	"Europe/Oslo",
	"Europe/Copenhagen",
	"Europe/Helsinki",
	"Europe/Warsaw",
	"Europe/Athens",
	"Europe/Istanbul",
	"Europe/Moscow",

	// Africa
	"Africa/Cairo",
	"Africa/Johannesburg",
	"Africa/Nairobi",

	// Asia
	"Asia/Dubai",
	"Asia/Kolkata",
	"Asia/Bangkok",
	"Asia/Singapore",
	"Asia/Hong_Kong",
	"Asia/Shanghai",
	"Asia/Tokyo",
	"Asia/Seoul",

	// Oceania
	"Australia/Sydney",
	"Australia/Brisbane",
	"Australia/Perth",
	"Pacific/Auckland"
];

export class WikiOTDSettingTab extends PluginSettingTab {
	plugin: WikiOTDPlugin;

	constructor(app: App, plugin: WikiOTDPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

		let tzSelectEl: HTMLSelectElement | null = null;

		new Setting(containerEl)
			.setName("On This Day in History")
			.setHeading();
		
		new Setting(containerEl)
			.setDesc("Control how dates and timezones are interpreted when fetching Wikipedia content.");

		new Setting(containerEl)
			.setName("Timezone")
			.setDesc("Auto uses your system timezone. Manual lets you choose one.")
			.addDropdown(dropdown => {
				dropdown
					.addOption("auto", "Auto (system)")
					.addOption("manual", "Manual")
					.setValue(this.plugin.settings.timeZoneMode)
					.onChange(async (value) => {
						this.plugin.settings.timeZoneMode = value as TimeZoneMode;

						// If switching to Manual, preselect system TZ (only if empty)
						if (this.plugin.settings.timeZoneMode === "manual") {
							if (!this.plugin.settings.manualTimeZone) {
								this.plugin.settings.manualTimeZone = systemTz;
							}
						}

						await this.plugin.saveSettings();

						if (tzSelectEl) tzSelectEl.disabled = this.plugin.settings.timeZoneMode !== "manual";
					});
			});

		new Setting(containerEl)
			.setName("Manual timezone")
			.setDesc(`System timezone: ${systemTz}`)
			.addDropdown(dropdown => {
				for (const tz of TIME_ZONES) dropdown.addOption(tz, tz);

				const current = this.plugin.settings.manualTimeZone || systemTz;
				if (!TIME_ZONES.includes(current)) dropdown.addOption(current, current);

				dropdown
					.setValue(current)
					.onChange(async (value) => {
						this.plugin.settings.manualTimeZone = value;
						await this.plugin.saveSettings();
					});

				tzSelectEl = dropdown.selectEl;
				tzSelectEl.disabled = this.plugin.settings.timeZoneMode !== "manual";
			});
	}
}
