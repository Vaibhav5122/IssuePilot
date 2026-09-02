"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Layers, LogOut, Plus, Check } from "lucide-react";
import Overview from "../sidebar/overview";
import Workspaces from "../sidebar/workspaces";
import Projects from "../sidebar/projects";
import Issues from "../sidebar/issues";
import Members from "../sidebar/members";
import Settings from "../sidebar/settings";
import { useUser, useLogout } from "@/lib/hooks/useAuth";
import { useActiveWorkspace } from "@/lib/hooks/useActiveWorkspace";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateWorkspace } from "@/components/workspace/createWorkspace";

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const { data: user } = useUser();
  const logout = useLogout();
  const { activeWorkspace, workspaces, setActiveWorkspaceId } = useActiveWorkspace();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "IP";

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col justify-between 
          bg-sidebar border-r border-sidebar-border p-4 text-sidebar-foreground transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <Link href="/overview" className="flex items-center gap-3 px-2 pt-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-xs">
              <Layers size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">
              IssuePilot
            </h1>
          </Link>

          {/* Workspace Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button className="flex w-full items-center justify-between rounded-xl bg-sidebar-accent/50 hover:bg-sidebar-accent border border-sidebar-border px-3 py-2.5 text-sm font-medium transition cursor-pointer">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
                    {activeWorkspace?.name?.[0]?.toUpperCase() || "W"}
                  </span>
                  <span className="truncate font-semibold text-sidebar-foreground">
                    {activeWorkspace?.name || "Select Workspace"}
                  </span>
                </div>
                <ChevronDown className="text-muted-foreground shrink-0" size={16} />
              </button>
            } />
            <DropdownMenuContent className="w-56" align="start">
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Workspaces
              </div>
              {workspaces && workspaces.length > 0 ? (
                workspaces.map((item: any) => {
                  const ws = item.workspace;
                  const isSelected = ws._id === activeWorkspace?._id;
                  return (
                    <DropdownMenuItem
                      key={ws._id || ws.id}
                      onClick={() => setActiveWorkspaceId(ws._id || ws.id)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{ws.name}</span>
                      {isSelected && <Check size={16} className="text-primary" />}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  No workspaces found
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setCreateModalOpen(true)}
                className="flex items-center gap-2 text-primary cursor-pointer font-medium"
              >
                <Plus size={16} /> Create Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Main Navigation */}
          <nav className="flex flex-col gap-1.5">
            <Overview />
            <Workspaces />
            <Projects />
            <Issues />
            <Members />
            <Settings />
          </nav>
        </div>

        {/* User Footer Menu */}
        <div className="border-t border-sidebar-border pt-3">
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button className="flex w-full items-center justify-between rounded-xl p-1.5 hover:bg-sidebar-accent transition cursor-pointer">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/30">
                    {userInitials}
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-xs font-semibold text-sidebar-foreground truncate">
                      {user?.name || "User"}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      {user?.email || ""}
                    </span>
                  </div>
                </div>
                <ChevronDown size={16} className="text-muted-foreground shrink-0" />
              </button>
            } />
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border mb-1">
                Signed in as <span className="font-semibold text-foreground">{user?.name}</span>
              </div>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer">
                  Settings & Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-500 hover:text-red-600 cursor-pointer flex items-center gap-2"
              >
                <LogOut size={16} /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <CreateWorkspace
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </>
  );
};

export default Sidebar;
