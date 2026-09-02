"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { useGetProjects } from "@/lib/hooks/useProjects";
import { useGetIssues, useUpdateIssue } from "@/lib/hooks/useIssues";
import { CreateIssueModal } from "@/components/issues/createIssue";
import { IssueDetailModal } from "@/components/issues/issueDetail";
import {
  Kanban,
  List,
  PlusIcon,
  Search,
  FolderKanban,
  AlertCircle,
  Clock,
  User,
  Loader2,
  ChevronDown,
  Layers,
} from "lucide-react";
import Link from "next/link";

export default function IssuesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialProjectId = searchParams.get("projectId");

  const { activeWorkspaceId, activeWorkspace } = useActiveWorkspace();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects(activeWorkspaceId);

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    } else if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0]._id || projects[0].id);
    }
  }, [projects, initialProjectId, selectedProjectId]);

  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const { data: issues, isLoading: isLoadingIssues } = useGetIssues(
    activeWorkspaceId,
    selectedProjectId,
    {
      search: search || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      type: typeFilter || undefined,
    }
  );

  const updateIssue = useUpdateIssue(activeWorkspaceId, selectedProjectId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  const columns = [
    {
      title: "TODO",
      key: "TODO",
      containerBg: "bg-blue-200/40 dark:bg-blue-950/30 border-blue-300/60 dark:border-blue-800/60",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      title: "IN PROGRESS",
      key: "IN_PROGRESS",
      containerBg: "bg-purple-200/40 dark:bg-purple-950/30 border-purple-300/60 dark:border-purple-800/60",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    },
    {
      title: "IN REVIEW",
      key: "IN_REVIEW",
      containerBg: "bg-amber-200/40 dark:bg-amber-950/30 border-amber-300/60 dark:border-amber-800/60",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      title: "DONE",
      key: "DONE",
      containerBg: "bg-emerald-200/40 dark:bg-emerald-950/30 border-emerald-300/60 dark:border-emerald-800/60",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
  ];

  const handleStatusDrop = (issueId: string, newStatus: string) => {
    updateIssue.mutate({ issueId, payload: { status: newStatus } });
  };

  if (!activeWorkspaceId) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 text-center rounded-2xl border border-dashed border-border bg-card space-y-4">
        <Layers className="mx-auto text-muted-foreground" size={40} />
        <h2 className="text-xl font-bold text-foreground">No Workspace Selected</h2>
        <p className="text-sm text-muted-foreground">
          Please select a workspace from the Overview page to access project issues.
        </p>
        <Link href="/overview">
          <Button className="rounded-xl bg-primary text-primary-foreground font-semibold">
            Go to Workspaces Overview
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Issue Board
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tracking issues for{" "}
            <span className="font-semibold text-foreground">
              {activeWorkspace?.name || "your active workspace"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Switcher Selector */}
          {projects && projects.length > 0 && (
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="h-10 rounded-xl border border-input bg-card px-3 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {projects.map((p: any) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  Project: {p.name} ({p.key})
                </option>
              ))}
            </select>
          )}

          {selectedProjectId && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-xs"
            >
              <PlusIcon size={18} /> New Issue
            </Button>
          )}
        </div>
      </div>

      {/* Control Bar: Search, Filters & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter issues by title..."
              className="pl-9 rounded-xl h-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-muted-foreground outline-none"
          >
            <option value="">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="IN_REVIEW">IN REVIEW</option>
            <option value="DONE">DONE</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-muted-foreground outline-none"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-muted-foreground outline-none"
          >
            <option value="">All Types</option>
            <option value="TASK">TASK</option>
            <option value="BUG">BUG</option>
            <option value="FEATURE">FEATURE</option>
            <option value="IMPROVEMENT">IMPROVEMENT</option>
          </select>
        </div>

        {/* View Mode Toggle Button */}
        <div className="flex items-center rounded-xl border border-border p-1 bg-muted/40 self-start md:self-auto">
          <button
            onClick={() => setViewMode("kanban")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "kanban"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Kanban size={14} /> Board
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === "list"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List size={14} /> List
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {isLoadingProjects || isLoadingIssues ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-3">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading issues...</span>
        </div>
      ) : !selectedProjectId ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-3">
          <FolderKanban className="mx-auto text-muted-foreground" size={36} />
          <h3 className="text-base font-bold text-foreground">No projects in this workspace</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Please create a project first before adding issues.
          </p>
          <Link href="/projects">
            <Button className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold">
              Go to Projects
            </Button>
          </Link>
        </div>
      ) : viewMode === "kanban" ? (
        /* Kanban Board View with Direct 200-300 Tint Column Backgrounds */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((col) => {
            const colIssues = issues?.filter((i: any) => i.status === col.key) || [];

            return (
              <div
                key={col.key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const issueId = e.dataTransfer.getData("text/plain");
                  if (issueId) handleStatusDrop(issueId, col.key);
                }}
                className={`rounded-2xl border p-4 ${col.containerBg} min-h-[500px] flex flex-col`}
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/40">
                  <span className="text-xs font-bold text-foreground">{col.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${col.badge}`}>
                    {colIssues.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colIssues.map((issue: any) => (
                    <div
                      key={issue._id || issue.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", issue._id || issue.id)}
                      onClick={() => setSelectedIssueId(issue._id || issue.id)}
                      className="group p-4 rounded-xl border border-border bg-card shadow-xs hover:shadow-md transition cursor-pointer hover:border-primary/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-mono font-semibold text-primary">
                          {issue.issueKey || `IP-${issue._id?.slice(-4)}`}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          issue.priority === "URGENT" || issue.priority === "HIGH"
                            ? "bg-red-500/10 text-red-600 dark:text-red-400"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {issue.priority}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {issue.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                        <span className="capitalize text-[11px]">{issue.type || "TASK"}</span>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-[10px]">
                          {issue.assignee?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">Key</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Assignee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issues && issues.length > 0 ? (
                  issues.map((issue: any) => (
                    <tr
                      key={issue._id || issue.id}
                      onClick={() => setSelectedIssueId(issue._id || issue.id)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-primary">
                        {issue.issueKey || `IP-${issue._id?.slice(-4)}`}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground max-w-xs truncate">
                        {issue.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-muted text-muted-foreground">
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary">
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground capitalize">
                        {issue.type || "TASK"}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {issue.assignee?.name || "Unassigned"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      No issues found for this project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {activeWorkspaceId && selectedProjectId && (
        <CreateIssueModal
          workspaceId={activeWorkspaceId}
          projectId={selectedProjectId}
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {activeWorkspaceId && selectedProjectId && selectedIssueId && (
        <IssueDetailModal
          workspaceId={activeWorkspaceId}
          projectId={selectedProjectId}
          issueId={selectedIssueId}
          onClose={() => setSelectedIssueId(null)}
        />
      )}
    </div>
  );
}
