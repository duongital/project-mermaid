import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Textarea } from "@/ui/textarea";

interface MermaidEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function MermaidEditor({ code, onChange }: MermaidEditorProps) {
  return (
    <Card className="h-full flex flex-col">
      <Textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="font-mono resize-none h-full"
        spellCheck={false}
        placeholder="Enter your Mermaid diagram code here..."
        style={{ fontSize: "0.75rem" }}
      />
    </Card>
  );
}
