import { useState, useEffect } from "react";
import { Routes, Route, useParams, useNavigate } from "react-router-dom";
import MermaidEditor from "./components/MermaidEditor";
import MermaidPreview from "./components/MermaidPreview";
import { AppSidebar } from "./components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "./ui/sidebar";
import { diagramDB, type Diagram } from "./services/diagramDB";
import { Eye, FileCode } from "lucide-react";

const defaultCode = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

type ViewMode = "preview" | "editor" | "split";

function DiagramView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [code, setCode] = useState(defaultCode);
  const [viewMode, setViewMode] = useState<ViewMode>("preview");
  const [currentDiagram, setCurrentDiagram] = useState<Diagram | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);

  // Initialize database
  useEffect(() => {
    const initDB = async () => {
      try {
        await diagramDB.init();
        setIsDbReady(true);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };
    initDB();
  }, []);

  // Load diagram from URL on mount or when id changes
  useEffect(() => {
    if (!isDbReady) return;

    const loadDiagram = async () => {
      if (!id) {
        setCurrentDiagram(null);
        setCode(defaultCode);
        return;
      }

      try {
        const diagramId = parseInt(id, 10);
        if (isNaN(diagramId)) {
          navigate("/");
          return;
        }

        const diagram = await diagramDB.getById(diagramId);
        if (diagram) {
          setCurrentDiagram(diagram);
          setCode(diagram.code);
        } else {
          // Diagram not found, redirect to home
          navigate("/");
        }
      } catch (error) {
        console.error("Failed to load diagram:", error);
        navigate("/");
      }
    };

    loadDiagram();
  }, [id, navigate, isDbReady]);

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
    navigate(`/${diagram.id}`);
  };

  const handleDiagramCreate = (diagram: Diagram) => {
    navigate(`/${diagram.id}`);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        currentDiagram={currentDiagram}
        onDiagramSelect={handleDiagramSelect}
        onDiagramCreate={handleDiagramCreate}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">
              {currentDiagram ? currentDiagram.name : "Mermaid Diagram Editor"}
            </h1>
          </div>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode("preview")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "preview"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("editor")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "editor"
                  ? "bg-background shadow-sm"
                  : "hover:bg-background/50"
              }`}
              title="Editor"
            >
              <FileCode className="h-4 w-4" />
            </button>
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<DiagramView />} />
      <Route path="/:id" element={<DiagramView />} />
    </Routes>
  );
}

export default App;
