"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePatchUpdateMembers } from "@/lib/hooks/useMembers/useMembers";
import { MoreVerticalIcon } from "lucide-react";
import { useState } from "react";

interface DropdownMenuSubmenuProps {
  memberId: string;
}

export function DropdownMenuSubmenu({ memberId }: DropdownMenuSubmenuProps) {
  const [isAdmin, setIsAdmin] = useState(true);
  console.log("mememe", memberId);
  const { mutate, isPending } = usePatchUpdateMembers(memberId);

  const handleRoleChange = (selectedRole: "ADMIN" | "MEMBER") => {
    mutate({ role: selectedRole });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline">
            <MoreVerticalIcon />
          </Button>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>Team</DropdownMenuItem> */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => handleRoleChange("ADMIN")}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRoleChange("MEMBER")}>
                  Member
                </DropdownMenuItem>
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Calendly</DropdownMenuItem>
                      <DropdownMenuItem>Slack</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Webhook</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub> */}
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem>Advanced...</DropdownMenuItem> */}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            className={"text-red-400 hover:bg-red-400 hover:text-red-500"}
          >
            Remove Member
            {/* <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
