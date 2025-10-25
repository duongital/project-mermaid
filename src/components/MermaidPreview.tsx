import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidPreviewProps {
  code: string;
}

export default function MermaidPreview({ code }: MermaidPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current || !code.trim()) return;

    const renderDiagram = async () => {
      try {
        const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
        const { svg } = await mermaid.render(id, code);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="error">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div className="preview-container">
      <h2>Preview</h2>
      <div ref={containerRef} className="mermaid-preview"></div>
    </div>
  );
}
