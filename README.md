# Slash Blocks

Type `/` at the start of a line to open a quick-access block menu — inspired by Superlist and Notion. Pick a block type and the corresponding Markdown is inserted instantly.

## Available blocks

- **Task** — inserts a to-do checkbox (`- [ ] `)
- **Paragraph** — plain text (clears the slash command)
- **Heading 1 / 2 / 3** — Markdown headings
- **Divider** — horizontal rule (`---`)
- **Bullet list** — unordered list item
- **Numbered list** — ordered list item
- **Blockquote** — quote block
- **Image** — image syntax with cursor placed inside the URL parentheses
- **Attachment** — link syntax with cursor placed inside the URL parentheses

## Usage

1. Place your cursor at the beginning of a line (or after a space).
2. Type `/`.
3. A suggestion menu appears — keep typing to filter, or use the arrow keys.
4. Press **Enter** to insert the selected block.

## Installation

Search for **Slash Blocks** in **Settings → Community plugins → Browse** and click **Install**.

## Development

```bash
npm install
npm run dev    # watch mode
npm run build  # production build
```

Copy the plugin folder into `<vault>/.obsidian/plugins/slash-blocks/` and enable it in Obsidian.

## License

[MIT](LICENSE)
