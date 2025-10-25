interface MermaidEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function MermaidEditor({ code, onChange }: MermaidEditorProps) {
  return (
    <div className="editor-container">
      <h2>Mermaid Code Editor</h2>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="code-editor"
        spellCheck={false}
        placeholder="Enter your Mermaid diagram code here..."
      />
    </div>
  );
}
