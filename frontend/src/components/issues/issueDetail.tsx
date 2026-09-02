"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  X,
  MessageSquare,
  History,
  Trash2,
  Send,
  User,
  Clock,
  Shield,
  Tag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  useGetIssueById,
  useUpdateIssue,
  useDeleteIssue,
  useGetIssueActivity,
} from "@/lib/hooks/useIssues";
import { useGetComments, useCreateComment, useDeleteComment } from "@/lib/hooks/useComments";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useGetWorkspaceMembers } from "@/lib/hooks/useMembers";
import { useUser } from "@/lib/hooks/useAuth";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";

interface IssueDetailModalProps {
  workspaceId: string;
  projectId: string;
  issueId: string | null;
  onClose: () => void;
}

export function IssueDetailModal({
  workspaceId,
  projectId,
  issueId,
  onClose,
}: IssueDetailModalProps) {
  const { data: issue, isLoading } = useGetIssueById(workspaceId, projectId, issueId);
  const { data: comments } = useGetComments(workspaceId, projectId, issueId);
  const { data: activities } = useGetIssueActivity(workspaceId, projectId, issueId);
  const { data: members } = useGetWorkspaceMembers(workspaceId);
  const { data: currentUser } = useUser();
  const { activeMemberRole } = useActiveWorkspace();
  const isAdmin = activeMemberRole === "ADMIN";

  const updateIssue = useUpdateIssue(workspaceId, projectId);
  const deleteIssue = useDeleteIssue(workspaceId, projectId);
  const createComment = useCreateComment(workspaceId, projectId, issueId);
  const deleteComment = useDeleteComment(workspaceId, projectId, issueId);

  const [commentText, setCommentText] = useState("");
  const [activeTab, setActiveTab] = useState<"comments" | "activity">("comments");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleConfirmDeleteComment = () => {
    if (!commentToDelete) return;
    deleteComment.mutate(commentToDelete, {
      onSuccess: () => {
        setCommentToDelete(null);
      },
    });
  };

  if (!issueId || !issue) return null;

  const handleStatusChange = (newStatus: string) => {
    updateIssue.mutate({ issueId, payload: { status: newStatus } });
  };

  const handlePriorityChange = (newPriority: string) => {
    updateIssue.mutate({ issueId, payload: { priority: newPriority } });
  };

  const handleAssigneeChange = (newAssigneeId: string) => {
    updateIssue.mutate({ issueId, payload: { assignee: newAssigneeId || null } as any });
  };

  const handleDeleteIssue = () => {
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteIssue.mutate(issueId, {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        onClose();
      },
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createComment.mutate(commentText.trim(), {
      onSuccess: () => {
        setCommentText("");
      },
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <span>{issue.issueKey || `IP-${issue._id?.slice(-4)}`}</span>
              <span>•</span>
              <span className="capitalize">{issue.type || "TASK"}</span>
            </div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">{issue.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteIssue}
              className="text-muted-foreground hover:text-red-500 rounded-lg"
            >
              <Trash2 size={18} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-lg">
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Description</h4>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap bg-muted/20 p-4 rounded-xl border border-border/50">
                {issue.description || "No description provided."}
              </p>
            </div>

            {/* Tabs for Comments & Activity */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-border text-sm font-semibold">
                <button
                  onClick={() => setActiveTab("comments")}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "comments"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <MessageSquare size={16} /> Comments ({comments ? comments.length : 0})
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`pb-2 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "activity"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <History size={16} /> Activity History
                </button>
              </div>

              {activeTab === "comments" ? (
                <div className="space-y-4">
                  {/* Add Comment */}
                  <form onSubmit={handlePostComment} className="flex gap-2">
                    <Input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="rounded-xl"
                    />
                    <Button
                      type="submit"
                      disabled={createComment.isPending || !commentText.trim()}
                      className="rounded-xl bg-primary text-primary-foreground font-medium shrink-0"
                    >
                      <Send size={16} />
                    </Button>
                  </form>

                  {/* List Comments */}
                  <div className="space-y-3 pt-2">
                    {comments && comments.length > 0 ? (
                      comments.map((comment: any) => {
                        const authorName = comment.author?.name || comment.user?.name || "Member";
                        const authorEmail = comment.author?.email || comment.user?.email;
                        const authorId = comment.author?._id || comment.author?.id || comment.author || comment.user?._id || comment.user?.id;
                        
                        const isAuthor =
                          (currentUser?.email && authorEmail && currentUser.email.toLowerCase() === authorEmail.toLowerCase()) ||
                          (authorId && currentUser?._id && authorId.toString() === currentUser._id.toString()) ||
                          (authorId && currentUser?.id && authorId.toString() === currentUser.id.toString());

                        const canDelete = isAuthor || isAdmin;

                        return (
                          <div
                            key={comment._id || comment.id}
                            className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                {authorName}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {canDelete && (
                                  <button
                                    type="button"
                                    onClick={() => setCommentToDelete(comment._id || comment.id)}
                                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer p-1 rounded-md transition-colors"
                                    title="Delete comment"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-foreground leading-normal">{comment.content}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        No comments yet. Start the conversation!
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {activities && activities.length > 0 ? (
                    activities.map((act: any) => {
                      const actorName = act.actor?.name || act.user?.name || "System";
                      
                      const getActivityLabel = () => {
                        if (act.action && typeof act.action === "string") return act.action;
                        if (act.type === "STATUS_CHANGED") {
                          const from = act.details?.from ? String(act.details.from).replace("_", " ") : "TODO";
                          const to = act.details?.to ? String(act.details.to).replace("_", " ") : "status";
                          return `changed status from ${from} to ${to}`;
                        }
                        if (act.type === "PRIORITY_CHANGED") {
                          const from = act.details?.from || "NONE";
                          const to = act.details?.to || "NONE";
                          return `changed priority from ${from} to ${to}`;
                        }
                        if (act.type === "ASSIGNEE_CHANGED") {
                          return act.details?.to ? "reassigned this issue" : "unassigned this issue";
                        }
                        if (act.type === "COMMENT_ADDED") {
                          return "commented on this issue";
                        }
                        if (act.type === "ISSUE_CREATED") {
                          return "created this issue";
                        }
                        if (typeof act.details === "string") {
                          return act.details;
                        }
                        if (typeof act.details === "object" && act.details !== null) {
                          if (act.details.from && act.details.to) {
                            return `updated from ${String(act.details.from)} to ${String(act.details.to)}`;
                          }
                          return "updated this issue";
                        }
                        return "updated this issue";
                      };

                      return (
                        <div
                          key={act._id || act.id}
                          className="p-3 rounded-xl border border-border bg-muted/10 text-xs flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-muted-foreground" />
                            <span className="font-medium text-foreground">{actorName}</span>
                            <span className="text-muted-foreground">{getActivityLabel()}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(act.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      No activity logged yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Attributes Column */}
          <div className="space-y-5 bg-muted/30 p-4 rounded-xl border border-border/60">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Status</label>
              <select
                value={issue.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-foreground outline-none"
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="IN_REVIEW">IN REVIEW</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Priority</label>
              <select
                value={issue.priority}
                onChange={(e) => handlePriorityChange(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-foreground outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Assignee</label>
              <select
                value={typeof issue.assignee === "object" ? (issue.assignee?._id || issue.assignee?.id || "") : (issue.assignee || "")}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="w-full h-9 rounded-lg border border-input bg-background px-2.5 text-xs font-medium text-foreground outline-none"
              >
                <option value="">Unassigned</option>
                {members?.map((m: any) => (
                  <option key={m.user?._id || m.user?.id} value={m.user?._id || m.user?.id}>
                    {m.user?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 text-xs space-y-1.5 border-t border-border text-muted-foreground">
              <div>Created: {new Date(issue.createdAt).toLocaleDateString()}</div>
              {issue.dueDate && (
                <div className="text-amber-600 dark:text-amber-400 font-semibold">
                  Due: {new Date(issue.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Issue"
        description={`Are you sure you want to delete issue "${issue.title}"? This action cannot be undone.`}
        confirmText="Delete Issue"
        variant="destructive"
        isLoading={deleteIssue.isPending}
      />

      <ConfirmDialog
        isOpen={!!commentToDelete}
        onClose={() => setCommentToDelete(null)}
        onConfirm={handleConfirmDeleteComment}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete Comment"
        variant="destructive"
        isLoading={deleteComment.isPending}
      />
    </div>
  );
}
