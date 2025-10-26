import { useState, useEffect } from "react";
import MermaidEditor from "./components/MermaidEditor";
import MermaidPreview from "./components/MermaidPreview";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./ui/sidebar";
import { diagramDB, type Diagram } from "./services/diagramDB";

const defaultCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

type ViewMode = "preview" | "editor" | "split";

function App() {
  const [code, setCode] = useState(defaultCode);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);

  // Auto-save diagram when code changes
  useEffect(() => {
    if (!currentDiagram?.id) return;

    const diagramId = currentDiagram.id;
    const timeoutId = setTimeout(async () => {
      try {
        await diagramDB.update(diagramId, { code });
      } catch (error) {
        console.error("Failed to auto-save diagram:", error);
      }
    }, 1000); // Auto-save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [code, currentDiagram]);

  const handleDiagramSelect = (diagram: Diagram) => {
    setCurrentDiagram(diagram);
    setCode(diagram.code);
  };

  const handleDiagramCreate = (diagram: Diagram) => {
    setCurrentDiagram(diagram);
    setCode(diagram.code);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentDiagram={currentDiagram}
        onDiagramSelect={handleDiagramSelect}
        onDiagramCreate={handleDiagramCreate}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">
              {currentDiagram ? currentDiagram.name : "Mermaid Diagram Editor"}
            </h1>
          </div>
        </header>
        <div
          className={`flex flex-1 overflow-hidden gap-4 p-4 ${
            viewMode === "preview" ? "justify-center" : ""
          }`}
        >
          {(viewMode === "editor" || viewMode === "split") && (
            <div className={viewMode === "split" ? "flex-1" : "w-full"}>
              <MermaidEditor code={code} onChange={setCode} />
            </div>
          )}
          {(viewMode === "preview" || viewMode === "split") && (
            <div className={viewMode === "split" ? "flex-1" : "w-full"}>
              <MermaidPreview code={code} />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
