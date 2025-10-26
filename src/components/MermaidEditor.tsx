import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Textarea } from "@/ui/textarea";

interface MermaidEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function MermaidEditor({ code, onChange }: MermaidEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;

    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const indentChar = "  "; // 2 spaces for indentation

      // If text is selected, indent each line
      if (start !== end) {
        const selectedText = code.substring(start, end);
        const beforeSelection = code.substring(0, start);
        const afterSelection = code.substring(end);

        // Find the start of the first selected line
        const lineStart = beforeSelection.lastIndexOf("\n") + 1;
        const selectedLines = beforeSelection.substring(lineStart) + selectedText;

        // Indent each line
        const indentedLines = selectedLines
          .split("\n")
          .map((line, index) => {
            // Don't indent the first line if it starts at column 0 and wasn't fully selected
            if (index === 0 && start === lineStart) {
              return indentChar + line;
            }
            return indentChar + line;
          })
          .join("\n");

        const newCode =
          code.substring(0, lineStart) +
          indentedLines +
          afterSelection;

        onChange(newCode);

        // Restore selection with adjusted positions
        setTimeout(() => {
          textarea.selectionStart = start + indentChar.length;
          textarea.selectionEnd = end + indentChar.length;
        }, 0);
      } else {
        // Insert indent at cursor position
        const newCode =
          code.substring(0, start) +
          indentChar +
          code.substring(start);

        onChange(newCode);

        // Move cursor after the inserted indent
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + indentChar.length;
        }, 0);
      }
    }

    // Handle Shift+Tab for unindentation
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const indentChar = "  "; // 2 spaces

      if (start !== end) {
        const selectedText = code.substring(start, end);
        const beforeSelection = code.substring(0, start);
        const afterSelection = code.substring(end);

        const lineStart = beforeSelection.lastIndexOf("\n") + 1;
        const selectedLines = beforeSelection.substring(lineStart) + selectedText;

        // Unindent each line
        const unindentedLines = selectedLines
          .split("\n")
          .map((line) => {
            if (line.startsWith(indentChar)) {
              return line.substring(indentChar.length);
            }
            return line;
          })
          .join("\n");

        const newCode =
          code.substring(0, lineStart) +
          unindentedLines +
          afterSelection;

        onChange(newCode);

        // Restore selection
        setTimeout(() => {
          textarea.selectionStart = Math.max(start - indentChar.length, lineStart);
          textarea.selectionEnd = end - indentChar.length;
        }, 0);
      } else {
        // Remove indent at cursor position
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        const lineBeforeCursor = code.substring(lineStart, start);

        if (lineBeforeCursor.endsWith(indentChar)) {
          const newCode =
            code.substring(0, start - indentChar.length) +
            code.substring(start);

          onChange(newCode);

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - indentChar.length;
          }, 0);
        }
      }
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <Textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="font-mono resize-none h-full"
        spellCheck={false}
        placeholder="Enter your Mermaid diagram code here..."
        style={{ fontSize: "0.75rem" }}
      />
    </Card>
  );
}
