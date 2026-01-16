# On This Day in History (Obsidian Plugin)

Insert Wikipedia’s “On this day” for today directly into your current Obsidian note — cleanly formatted as Markdown.

The plugin fetches the current day’s Wikipedia page (e.g. *January 3*), extracts the Events, Births, and Deaths sections, and inserts them at your cursor position.

---

## Features

- Fetches Wikipedia "On this day" content for today or any specific date
- Inserts directly into the active note
- Automatically filters out page noise
- Converts relative Wikipedia links to full URLs
- Customizable link display (inline, grouped, or none)
- Clean, readable Markdown output
- Works via command palette **or** ribbon icon

---

## Usage

### Insert Today's Events

**Via Command Palette:**
1. Open a Markdown note
2. Open the Command Palette (`⌘P` / `Ctrl+P`)
3. Run **"Insert today's events from history."**

**Via Ribbon Icon:**
Click the **calendar-clock** icon in the left sidebar to insert today's entry into the active note.

### Insert Events from a Specific Date

1. Open a Markdown note
2. Open the Command Palette (`⌘P` / `Ctrl+P`)
3. Run **"Insert historical events from a specific date."**
4. Select the month and day in the date picker dialog

---

## Settings

### Timezone

By default, the plugin uses your system timezone (**Auto**) to determine what “today” means.

If you travel, or if you for any other reason want more control, you can switch to **Manual** timezone mode:

- **Auto (default)**  
  Uses your system’s current timezone.

- **Manual**
  Lets you choose a specific timezone. When switching to Manual, the system-detected timezone is preselected for convenience.

### Link Display

Control how Wikipedia links appear in the inserted content:

- **Inline (default)**
  Links appear naturally within the text, preserving the original Wikipedia formatting.

- **Grouped**
  Link text appears in the content without hyperlinks, and all links are collected under a "**Links**" section at the end of each subsection (Events, Births, Deaths).

- **None**
  All links are removed, leaving only plain text.

You can find these settings under:

**Settings → On This Day in History**

---

## Output Examples

### Inline (default)

```md
## January 3

## Events
- [1521](https://en.wikipedia.org/wiki/1521) – [Martin Luther](https://en.wikipedia.org/wiki/Martin_Luther) is excommunicated from the [Catholic Church](https://en.wikipedia.org/wiki/Catholic_Church).

## Births
- [1892](https://en.wikipedia.org/wiki/1892) – [J. R. R. Tolkien](https://en.wikipedia.org/wiki/J._R._R._Tolkien), English author (d. 1973)
```

### Grouped

```md
## January 3

## Events
- 1521 – Martin Luther is excommunicated from the Catholic Church.

**Links**

- [1521](https://en.wikipedia.org/wiki/1521)
- [Martin Luther](https://en.wikipedia.org/wiki/Martin_Luther)
- [Catholic Church](https://en.wikipedia.org/wiki/Catholic_Church)

## Births
- 1892 – J. R. R. Tolkien, English author (d. 1973)

**Links**

- [1892](https://en.wikipedia.org/wiki/1892)
- [J. R. R. Tolkien](https://en.wikipedia.org/wiki/J._R._R._Tolkien)
```

### None

```md
## January 3

## Events
- 1521 – Martin Luther is excommunicated from the Catholic Church.

## Births
- 1892 – J. R. R. Tolkien, English author (d. 1973)
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
