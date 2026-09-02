"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateWorkspace } from "@/components/workspace/createWorkspace";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { FolderIcon, PlusIcon, Users, Check, Shield, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function WorkspacesPage() {
  const { workspaces, isLoadingWorkspaces, activeWorkspaceId, setActiveWorkspaceId } = useActiveWorkspace();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Workspaces
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your workspaces, team access, and switch contexts.
          </p>
        </div>

        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-xs"
        >
          <PlusIcon size={18} /> New Workspace
        </Button>
      </div>

      <CreateWorkspace isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Grid of Workspaces */}
      {isLoadingWorkspaces ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-3">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading workspaces...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces && workspaces.length > 0 ? (
            workspaces.map((item: any) => {
              const ws = item.workspace;
              const wsId = ws?._id || ws?.id;
              const isActive = wsId === activeWorkspaceId;

              return (
                <div
                  key={wsId}
                  className={`flex flex-col justify-between gap-5 rounded-2xl border p-6 shadow-xs transition hover:shadow-md ${
                    isActive
                      ? "border-primary/50 bg-primary/5 dark:bg-primary/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <FolderIcon size={24} />
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      }`}>
                        {item.role === "ADMIN" && <Shield size={12} />} {item.role}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground truncate">
                      {ws.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2rem]">
                      {ws.description || "No description provided."}
                    </p>
                  </div>

                  <div className="space-y-3 border-t border-border pt-4 text-xs">
                    <div className="flex items-center justify-between">
                      <Link
                        href="/members"
                        onClick={() => setActiveWorkspaceId(wsId)}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-primary font-medium transition-colors"
                      >
                        <Users size={14} /> View Members
                      </Link>

                      {isActive ? (
                        <span className="flex items-center gap-1 font-semibold text-primary">
                          <Check size={14} /> Active
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveWorkspaceId(wsId)}
                          className="h-7 text-xs font-semibold rounded-lg"
                        >
                          Select Workspace
                        </Button>
                      )}
                    </div>

                    <Link href="/projects" onClick={() => setActiveWorkspaceId(wsId)}>
                      <Button variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold justify-between mt-1">
                        Go to Projects <ArrowRight size={14} />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <FolderIcon className="mx-auto text-muted-foreground mb-3" size={32} />
              <h3 className="text-base font-bold text-foreground">No workspaces found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                You are not a member of any workspace yet. Create a workspace to get started!
              </p>
              <Button
                onClick={() => setIsOpen(true)}
                className="mt-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Create Workspace
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
