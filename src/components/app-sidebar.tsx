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
import { Plus, Trash2, Edit, FileText, MoreVertical } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";

interface AppSidebarProps {
  currentDiagram: Diagram | null;
  onDiagramSelect: (diagram: Diagram) => void;
  onDiagramCreate: (diagram: Diagram) => void;
}

export function AppSidebar({
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
          <div className="px-2 py-1 flex items-center gap-2">
            <img src="/vite.svg" alt="Vite" className="h-6 w-6" />
            <h2 className="text-lg font-semibold font-mono">Project Mermaid</h2>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-2 pb-2">
              <SidebarGroupLabel>
                <span className="text-lg">My Diagrams</span>
              </SidebarGroupLabel>
              <Button
                size="icon"
                variant="outline"
                className="h-10 w-10"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-8 w-8" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {diagrams.length === 0 ? (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                    No diagrams yet. <br /> Click + to create one.
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingDiagram(diagram);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingDiagram(diagram);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </SidebarMenuItem>
                  ))
                )}
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
