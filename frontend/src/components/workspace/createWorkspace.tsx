"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { X, Loader2 } from "lucide-react";
import { usePostCreateWorkspace } from "@/lib/hooks/useWorkspace/useGetWorkspace";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";

import { toast } from "sonner";

export const CreateWorkspace = ({ isOpen, onClose }: any) => {
  const { setActiveWorkspaceId } = useActiveWorkspace();
  const [create, setCreate] = useState({ name: "", description: "" });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCreate({ name: "", description: "" });
    document.body.style.overflow = "";
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCreate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: createWorkspace, isPending: isLoading } =
    usePostCreateWorkspace();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedName = create.name.trim();
    if (!trimmedName) {
      toast.error("Workspace name is required");
      return;
    }
    if (trimmedName.length < 2) {
      toast.error("Workspace name must be at least 2 characters");
      return;
    }

    createWorkspace(
      {
        name: trimmedName,
        description: create.description.trim() || undefined,
      },
      {
        onSuccess: (res: any) => {
          const ws = res?.workspace || res?.data?.workspace || res;
          const newWsId =
            ws?.id ||
            ws?._id ||
            res?.data?.workspace?.id ||
            res?.data?.workspace?._id ||
            res?.data?.id ||
            res?.id;
          if (newWsId) {
            setActiveWorkspaceId(newWsId);
          }
          handleClose();
        },
        onError: (error) => {
          console.error("Failed to create workspace:", error);
        },
      },
    );
  };

  return (
    <div
      onClick={handleClose}
      className="p-4 fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card text-card-foreground p-6 rounded-2xl shadow-2xl w-full max-w-md border border-border space-y-5 animate-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h3 className="font-bold text-lg text-foreground">
            Create Workspace
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground rounded-lg p-1 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Workspace Name <span className="text-destructive">*</span>
            </label>
            <input
              name="name"
              value={create.name}
              onChange={handleChange}
              type="text"
              placeholder="e.g. Engineering, Marketing, Acme Corp"
              autoFocus
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground">
              Description{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <textarea
              name="description"
              value={create.description}
              onChange={handleChange}
              rows={3}
              placeholder="What will this workspace be used for?"
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !create.name.trim()}
              className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-5 flex items-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={14} />}
              {isLoading ? "Creating..." : "Create Workspace"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

