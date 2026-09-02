"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { useGetProjects } from "@/lib/hooks/useProjects";
import { useGetWorkspaceMembers } from "@/lib/hooks/useMembers";
import { CreateProjectModal } from "@/components/projects/createProject";
import {
  FolderIcon,
  CircleDotIcon,
  CircleCheck,
  Users,
  PlusIcon,
  ChevronRight,
  Kanban,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const { activeWorkspaceId, activeWorkspace, activeMemberRole } = useActiveWorkspace();
  const { data: projects } = useGetProjects(activeWorkspaceId);
  const { data: members } = useGetWorkspaceMembers(activeWorkspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = activeMemberRole === "ADMIN";

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {activeWorkspace?.name || "Workspace Overview"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview of projects, member activity, and issue management.
          </p>
        </div>

        {isAdmin && activeWorkspaceId && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-xs"
          >
            <PlusIcon size={18} /> New Project
          </Button>
        )}
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="rounded-xl bg-blue-500/10 p-3.5 text-blue-500">
            <FolderIcon size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Active Projects</p>
            <h2 className="text-2xl font-bold text-foreground mt-0.5">
              {projects ? projects.length : 0}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="rounded-xl bg-purple-500/10 p-3.5 text-purple-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Workspace Members</p>
            <h2 className="text-2xl font-bold text-foreground mt-0.5">
              {members ? members.length : 0}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="rounded-xl bg-emerald-500/10 p-3.5 text-emerald-500">
            <CircleCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Role Permission</p>
            <h2 className="text-xl font-bold text-foreground mt-0.5 capitalize">
              {activeMemberRole || "Member"}
            </h2>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Projects</h2>
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="text-xs font-semibold gap-1 text-primary">
              View All <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project: any) => (
              <div
                key={project._id || project.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-primary/10 text-primary">
                      {project.key}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base truncate">{project.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <Link href={`/issues?projectId=${project._id || project.id}`}>
                    <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold gap-1.5 w-full">
                      <Kanban size={14} /> View Issue Board
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
            <p className="text-sm">No projects created yet in this workspace.</p>
            {isAdmin && activeWorkspaceId && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Create First Project
              </Button>
            )}
          </div>
        )}
      </div>

      {activeWorkspaceId && (
        <CreateProjectModal
          workspaceId={activeWorkspaceId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
