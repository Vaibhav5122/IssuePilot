"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, FolderPlus } from "lucide-react";
import { useCreateProject } from "@/lib/hooks/useProjects";

interface CreateProjectModalProps {
  workspaceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({
  workspaceId,
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [description, setDescription] = useState("");

  const createProject = useCreateProject(workspaceId);

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!key || key.length < 5) {
      const generatedKey = val.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4);
      if (generatedKey) setKey(generatedKey);
    }
  };

  const handleClose = () => {
    setName("");
    setKey("");
    setDescription("");
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    createProject.mutate(
      {
        name: name.trim(),
        key: key.trim().toUpperCase(),
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <FolderPlus size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground">Create Project</h3>
              <p className="text-xs text-muted-foreground">Add a new project to your workspace.</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-lg">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Project Name *
            </label>
            <Input
              type="text"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. E-Commerce Redesign"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Project Key (Short Code) *
            </label>
            <Input
              type="text"
              required
              maxLength={10}
              value={key}
              onChange={(e) => setKey(e.target.value.toUpperCase())}
              placeholder="e.g. ECOM"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Used as prefix for issues (e.g. {key || "KEY"}-101)
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the scope and objective of this project..."
              className="w-full h-24 rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createProject.isPending}
              className="rounded-xl bg-primary text-primary-foreground font-medium"
            >
              {createProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
