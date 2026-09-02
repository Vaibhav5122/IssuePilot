"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { useGetProjects, useDeleteProject } from "@/lib/hooks/useProjects";
import { CreateProjectModal } from "@/components/projects/createProject";
import {
  FolderKanban,
  PlusIcon,
  Search,
  Kanban,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function ProjectsPage() {
  const { activeWorkspaceId, activeWorkspace, activeMemberRole } = useActiveWorkspace();
  const { data: projects, isLoading } = useGetProjects(activeWorkspaceId);
  const deleteProject = useDeleteProject(activeWorkspaceId);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = activeMemberRole === "ADMIN";

  const filteredProjects = projects?.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.key.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (projectId: string, projName: string) => {
    if (confirm(`Are you sure you want to delete project "${projName}"?`)) {
      deleteProject.mutate(projectId);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Projects in{" "}
            <span className="font-semibold text-foreground">
              {activeWorkspace?.name || "your workspace"}
            </span>
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

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or key..."
            className="pl-9 rounded-xl"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-3">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading projects...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects && filteredProjects.length > 0 ? (
            filteredProjects.map((project: any) => (
              <div
                key={project._id || project.id}
                className="group flex flex-col justify-between gap-5 rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:shadow-md hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 font-bold text-sm">
                      {project.key}
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project._id || project.id, project.name)}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {project.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[2.5rem]">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    Key: {project.key}
                  </span>
                  <Link href={`/issues?projectId=${project._id || project.id}`}>
                    <Button size="sm" className="rounded-xl text-xs font-semibold gap-1.5">
                      <Kanban size={14} /> Open Issues <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <FolderKanban className="mx-auto text-muted-foreground mb-3" size={32} />
              <h3 className="text-base font-bold text-foreground">No projects found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {search ? "No projects match your search criteria." : "Create your first project to start tracking issues."}
              </p>
              {isAdmin && activeWorkspaceId && !search && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
                >
                  Create Project
                </Button>
              )}
            </div>
          )}
        </div>
      )}

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
