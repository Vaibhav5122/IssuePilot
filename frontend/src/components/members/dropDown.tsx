"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUpdateMemberRole, useRemoveWorkspaceMember } from "@/lib/hooks/useMembers";
import { MoreVerticalIcon, Shield, UserX } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface MemberActionsProps {
  workspaceId: string;
  userId: string;
  currentRole: string;
  isSelf?: boolean;
}

export function DropdownMenuSubmenu({
  workspaceId,
  userId,
  currentRole,
  isSelf = false,
}: MemberActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveWorkspaceMember(workspaceId);

  const handleRoleChange = (role: "ADMIN" | "MEMBER") => {
    if (!userId || !workspaceId) return;
    if (role === currentRole) return;
    updateRole.mutate({ memberId: userId, role });
  };

  const handleConfirmRemove = () => {
    if (!userId || !workspaceId) return;
    removeMember.mutate(userId, {
      onSuccess: () => setConfirmOpen(false),
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
              <MoreVerticalIcon size={16} />
              <span className="sr-only">Actions</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="flex items-center gap-2 cursor-pointer">
                <Shield size={14} />
                <span>Change Role</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  disabled={currentRole === "ADMIN"}
                  onClick={() => handleRoleChange("ADMIN")}
                  className="cursor-pointer font-medium"
                >
                  Admin {currentRole === "ADMIN" && "✓"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={currentRole === "MEMBER"}
                  onClick={() => handleRoleChange("MEMBER")}
                  className="cursor-pointer"
                >
                  Member {currentRole === "MEMBER" && "✓"}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isSelf}
              onClick={() => setConfirmOpen(true)}
              className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
            >
              <UserX size={14} />
              <span>Remove Member</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove Member"
        description="Are you sure you want to remove this member from the workspace? They will lose access to all projects, issues, and discussions in this workspace."
        confirmText="Remove Member"
        variant="destructive"
        isLoading={removeMember.isPending}
      />
    </>
  );
}
