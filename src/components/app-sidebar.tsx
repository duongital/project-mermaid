import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/ui/sidebar";
import {
  FileCode,
  Eye,
  Columns2,
  Settings,
  Plus,
  Trash2,
  Edit,
  FileText,
} from "lucide-react";
import { Button } from "@/ui/button";
import { DiagramModal } from "./DiagramModal";
import { diagramDB, type Diagram } from "@/services/diagramDB";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/ui/alert-dialog";

type ViewMode = "preview" | "editor" | "split";

interface AppSidebarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  currentDiagram: Diagram | null;
  onDiagramSelect: (diagram: Diagram) => void;
  onDiagramCreate: (diagram: Diagram) => void;
}

export function AppSidebar({
  viewMode,
  onViewModeChange,
  currentDiagram,
  onDiagramSelect,
  onDiagramCreate,
}: AppSidebarProps) {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiagram, setEditingDiagram] = useState<Diagram | null>(null);
  const [deletingDiagram, setDeletingDiagram] = useState<Diagram | null>(null);

  useEffect(() => {
    const initDB = async () => {
      await diagramDB.init();
      await loadDiagrams();
    };
    initDB();
  }, []);

  const loadDiagrams = async () => {
    try {
      const allDiagrams = await diagramDB.getAll();
      setDiagrams(allDiagrams);
    } catch (error) {
      console.error("Failed to load diagrams:", error);
    }
  };

  const handleCreateDiagram = async (name: string) => {
    try {
      const newDiagram = {
        name,
        code: "graph TD\n    A[Start] --> B[End]",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const id = await diagramDB.create(newDiagram);
      const createdDiagram = { ...newDiagram, id };
      await loadDiagrams();
      onDiagramCreate(createdDiagram);
    } catch (error) {
      console.error("Failed to create diagram:", error);
    }
  };

  const handleEditDiagram = async (name: string) => {
    if (!editingDiagram?.id) return;

    try {
      await diagramDB.update(editingDiagram.id, { name });
      await loadDiagrams();
      setEditingDiagram(null);
    } catch (error) {
      console.error("Failed to update diagram:", error);
    }
  };

  const handleDeleteDiagram = async () => {
    if (!deletingDiagram?.id) return;

    try {
      await diagramDB.delete(deletingDiagram.id);
      await loadDiagrams();
      setDeletingDiagram(null);
    } catch (error) {
      console.error("Failed to delete diagram:", error);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="px-2 py-1">
            <h2 className="text-lg font-semibold">Mermaid Editor</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>View Mode</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === "preview"}
                    onClick={() => onViewModeChange("preview")}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === "split"}
                    onClick={() => onViewModeChange("split")}
                  >
                    <Columns2 className="h-4 w-4" />
                    <span>Split View</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={viewMode === "editor"}
                    onClick={() => onViewModeChange("editor")}
                  >
                    <FileCode className="h-4 w-4" />
                    <span>Editor</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <div className="flex items-center justify-between px-2 pb-2">
              <SidebarGroupLabel>My Diagrams</SidebarGroupLabel>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {diagrams.length === 0 ? (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No diagrams yet. Click + to create one.
                  </div>
                ) : (
                  diagrams.map((diagram) => (
                    <SidebarMenuItem key={diagram.id}>
                      <div className="flex items-center w-full group">
                        <SidebarMenuButton
                          isActive={currentDiagram?.id === diagram.id}
                          onClick={() => onDiagramSelect(diagram)}
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="truncate">{diagram.name}</span>
                        </SidebarMenuButton>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingDiagram(diagram);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingDiagram(diagram);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <DiagramModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleCreateDiagram}
        mode="create"
      />

      <DiagramModal
        open={!!editingDiagram}
        onOpenChange={(open) => !open && setEditingDiagram(null)}
        onSubmit={handleEditDiagram}
        initialName={editingDiagram?.name || ""}
        mode="edit"
      />

      <AlertDialog
        open={!!deletingDiagram}
        onOpenChange={(open) => !open && setDeletingDiagram(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Diagram</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingDiagram?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDiagram}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
