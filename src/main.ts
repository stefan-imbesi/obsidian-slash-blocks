
import {
  Editor,
  Plugin,
  EditorSuggest,
  EditorSuggestContext,
  EditorSuggestTriggerInfo,
  EditorPosition,
  TFile,
} from "obsidian";

type BlockOption = {
  id: string;
  label: string;
  markdown: string;
  hint?: string;
  cursorAdjust?: number; // Negative moves cursor back from end
};

const BLOCK_OPTIONS: BlockOption[] = [
  { id: "task", label: "Task", markdown: "- [ ] ", hint: "To-do item" },
  { id: "paragraph", label: "Paragraph", markdown: "", hint: "Plain text" },
  { id: "h1", label: "Heading 1", markdown: "# " },
  { id: "h2", label: "Heading 2", markdown: "## " },
  { id: "h3", label: "Heading 3", markdown: "### " },
  { id: "divider", label: "Divider", markdown: "---\n" },
  { id: "bullet", label: "Bullet list", markdown: "- " },
  { id: "numbered", label: "Numbered list", markdown: "1. " },
  { id: "blockquote", label: "Blockquote", markdown: "> " },
  { id: "image", label: "Image", markdown: "![]()", cursorAdjust: -1 },
  { id: "attachment", label: "Attachment", markdown: "[]()", cursorAdjust: -1 },
];

class SlashBlocksSuggest extends EditorSuggest<BlockOption> {
  private lastContext: EditorSuggestContext | null = null;

  onTrigger(
    cursor: EditorPosition,
    editor: Editor,
    file: TFile | null
  ): EditorSuggestTriggerInfo | null {
    const line = editor.getLine(cursor.line);
    const left = line.substring(0, cursor.ch);

    // Match word after the last slash at start of line or after whitespace
    const match = left.match(/(?:^|\s)\/([\w-]*)$/);
    if (!match) return null;

    const startCh = left.lastIndexOf("/");
    const start: EditorPosition = { line: cursor.line, ch: startCh };
    const end: EditorPosition = cursor;
    const query = match[1] ?? "";
    return { start, end, query };
  }

  getSuggestions(context: EditorSuggestContext): BlockOption[] {
    this.lastContext = context;
    const q = context.query.toLowerCase();
    if (!q) return BLOCK_OPTIONS;
    return BLOCK_OPTIONS.filter(
      (o) => o.label.toLowerCase().includes(q) || o.id.includes(q)
    );
  }

  renderSuggestion(value: BlockOption, el: HTMLElement): void {
    const container = el.createDiv({ cls: "slash-blocks-item" });
    container.createEl("div", { text: value.label, cls: "slash-blocks-label" });
    if (value.hint)
      container.createEl("div", { text: value.hint, cls: "slash-blocks-hint" });
  }

  selectSuggestion(value: BlockOption): void {
    if (!this.lastContext) return;
    const { editor, start, end } = this.lastContext;

    // Remove the '/query'
    editor.replaceRange("", start, end);

    // Insert the markdown where the slash began
    editor.replaceRange(value.markdown, start);

    // Move cursor to end of the inserted text (with optional adjust)
    const finalPos: EditorPosition = {
      line: start.line,
      ch: start.ch + value.markdown.length + (value.cursorAdjust ?? 0),
    };
    editor.setCursor(finalPos);
  }
}

export default class SlashBlocksPlugin extends Plugin {
  onload(): void {
    this.registerEditorSuggest(new SlashBlocksSuggest(this.app));
  }

  onunload(): void {
    // cleanup handled by Obsidian
  }
}
