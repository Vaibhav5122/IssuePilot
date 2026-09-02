"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { CreateWorkspace } from "@/components/workspace/createWorkspace";
import {
  Layers,
  Shield,
  User,
  PlusIcon,
  ArrowRight,
  FolderKanban,
  Kanban,
  Users,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const router = useRouter();
  const { workspaces, isLoadingWorkspaces, activeWorkspaceId, setActiveWorkspaceId } = useActiveWorkspace();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const adminWorkspacesCount = workspaces?.filter((w: any) => w.role === "ADMIN").length || 0;
  const memberWorkspacesCount = workspaces?.filter((w: any) => w.role === "MEMBER").length || 0;

  const handleEnterWorkspace = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
    router.push("/projects");
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Workspaces Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All workspaces you own or participate in. Select a workspace to access its projects, issues, and team members.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-xs"
        >
          <PlusIcon size={18} /> Create Workspace
        </Button>
      </div>

      {/* Global Workspaces Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="rounded-xl bg-primary/10 p-3.5 text-primary">
            <Layers size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Workspaces</p>
            <h2 className="text-2xl font-bold text-foreground mt-0.5">
              {workspaces ? workspaces.length : 0}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="rounded-xl bg-purple-500/10 p-3.5 text-purple-500">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Admin Access</p>
            <h2 className="text-2xl font-bold text-foreground mt-0.5">
              {adminWorkspacesCount}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="rounded-xl bg-blue-500/10 p-3.5 text-blue-500">
            <User size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Member Access</p>
            <h2 className="text-2xl font-bold text-foreground mt-0.5">
              {memberWorkspacesCount}
            </h2>
          </div>
        </div>
      </div>

      {/* Workspaces Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground tracking-tight">Your Workspaces</h2>

        {isLoadingWorkspaces ? (
          <div className="flex items-center justify-center p-12 text-muted-foreground gap-3">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading workspaces...</span>
          </div>
        ) : workspaces && workspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((item: any) => {
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-sm">
                        {ws.name?.[0]?.toUpperCase() || "W"}
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
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2.25rem]">
                      {ws.description || "No description provided."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border space-y-3">
                    <Button
                      onClick={() => handleEnterWorkspace(wsId)}
                      className="w-full rounded-xl bg-primary text-primary-foreground font-medium text-xs justify-between"
                    >
                      <span>Enter Workspace</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            <Layers className="mx-auto text-muted-foreground mb-3" size={32} />
            <h3 className="text-base font-bold text-foreground">No workspaces found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You haven't created or been added to any workspaces yet.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
            >
              Create Workspace
            </Button>
          </div>
        )}
      </div>

      <CreateWorkspace
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
