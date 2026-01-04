# On This Day in History (Obsidian Plugin)

Insert Wikipedia’s “On this day” for today directly into your current Obsidian note — cleanly formatted as Markdown.

The plugin fetches the current day’s Wikipedia page (e.g. *January 3*), extracts the Events, Births, and Deaths sections, and inserts them at your cursor position.

---

## Features

- Fetches *today’s* Wikipedia “On this day” content
- Inserts directly into the active note
- Automatically filters out page noise
- Converts relative Wikipedia links to full URLs
- Clean, readable Markdown output
- Works via command palette **or** ribbon icon

---

## Usage

### Insert via Command Palette

1. Open a Markdown note
2. Open the Command Palette (`⌘P` / `Ctrl+P`)
3. Run **“Insert: Wikipedia ‘On this day’ (today)”**

### Insert via Ribbon Icon

Click the **calendar-clock** icon in the left sidebar to insert today’s entry into the active note.

---

## Settings

### Timezone

By default, the plugin uses your system timezone (**Auto**) to determine what “today” means.

If you travel, or if you for any other reason want more control, you can switch to **Manual** timezone mode:

- **Auto (default)**  
  Uses your system’s current timezone.

- **Manual**  
  Lets you choose a specific timezone. When switching to Manual, the system-detected timezone is preselected for convenience.

You can find this setting under:

**Settings → On This Day in History**

---

## Output Example

```md
## January 3

## Events
- 1521 – Martin Luther is excommunicated from the Catholic Church.

## Births
- 1892 – J. R. R. Tolkien, English author (d. 1973)

## Deaths
- 2009 – Karyn Kupcinet, American actress (b. 1941)
```

## Installation

### From Community Plugins

1. Open **Settings → Community Plugins**
2. Disable Safe Mode
3. Search for **Wiki On This Day**
4. Install & enable

### Manual Installation

1. Download the latest release
2. Copy the plugin folder into your vault’s `.obsidian/plugins/` directory
3. Enable the plugin in Obsidian settings

---

## Privacy

This plugin:
- Does **not** collect or store user data
- Makes requests only to `en.wikipedia.org`
- Performs all processing locally in Obsidian

---

## Development

Built using:
- Obsidian Plugin API
- MediaWiki Action API
- Turndown (HTML → Markdown)

PRs and suggestions are welcome.

---

## License

MIT License

Copyright © 2026 Michael Edlund
