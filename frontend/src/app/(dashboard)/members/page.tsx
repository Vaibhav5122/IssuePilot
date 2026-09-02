"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import { useGetWorkspaceMembers } from "@/lib/hooks/useMembers";
import { useUser } from "@/lib/hooks/useAuth";
import { DropdownMenuSubmenu } from "@/components/members/dropDown";
import { AddMember } from "@/components/members/addMember";
import { UserPlusIcon, Users, Shield, User, Loader2 } from "lucide-react";

export default function MembersPage() {
  const { activeWorkspaceId, activeWorkspace, activeMemberRole } = useActiveWorkspace();
  const { data: user } = useUser();
  const { data: members, isLoading, error } = useGetWorkspaceMembers(activeWorkspaceId);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isAdmin = activeMemberRole === "ADMIN";

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto space-y-8">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Workspace Members
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage member access, roles, and invitations for{" "}
            <span className="font-semibold text-foreground">
              {activeWorkspace?.name || "your active workspace"}
            </span>.
          </p>
        </div>

        {isAdmin && activeWorkspaceId && (
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="rounded-xl bg-primary text-primary-foreground font-medium flex items-center gap-2 shadow-xs"
          >
            <UserPlusIcon size={18} /> Add Member
          </Button>
        )}
      </div>

      {/* Member Count Stats */}
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Users size={18} className="text-primary" />
        <span>{members ? members.length : 0} Total Members</span>
      </div>

      {/* Members Table */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-muted-foreground gap-3">
          <Loader2 className="animate-spin" size={20} />
          <span>Loading workspace members...</span>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive text-sm font-medium">
          Failed to load workspace members. Please verify access permissions.
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {members && members.length > 0 ? (
                  members.map((member: any) => {
                    const isSelf = member.user?._id === user?._id || member.user?.id === user?._id;
                    const joinDate = member.createdAt
                      ? new Date(member.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <tr key={member._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                              {member.user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {member.user?.name || "Unknown User"}
                                {isSelf && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {member.user?.email || "—"}
                        </td>
                        <td className="px-6 py-4">
                          {member.role === "ADMIN" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                              <Shield size={12} /> Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <User size={12} /> Member
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {joinDate}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {isAdmin && activeWorkspaceId ? (
                            <DropdownMenuSubmenu
                              workspaceId={activeWorkspaceId}
                              memberId={member._id}
                              currentRole={member.role}
                              isSelf={isSelf}
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                      No members found in this workspace.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeWorkspaceId && (
        <AddMember
          workspaceId={activeWorkspaceId}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
}
