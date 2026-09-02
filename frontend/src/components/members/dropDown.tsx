"use client";

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

interface MemberActionsProps {
  workspaceId: string;
  memberId: string;
  currentRole: string;
  isSelf?: boolean;
}

export function DropdownMenuSubmenu({
  workspaceId,
  memberId,
  currentRole,
  isSelf = false,
}: MemberActionsProps) {
  const updateRole = useUpdateMemberRole(workspaceId);
  const removeMember = useRemoveWorkspaceMember(workspaceId);

  const handleRoleChange = (role: "ADMIN" | "MEMBER") => {
    if (role === currentRole) return;
    updateRole.mutate({ memberId, role });
  };

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove this member from the workspace?")) {
      removeMember.mutate(memberId);
    }
  };

  return (
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
            onClick={handleRemove}
            className="text-red-500 hover:text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
          >
            <UserX size={14} />
            <span>Remove Member</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
