"use client";

import {
  ChevronDown,
  FolderClosedIcon,
  HomeIcon,
  Layers,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import React from "react";
import Link from "next/link";

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col justify-between 
        bg-[#090e24] p-4 text-white transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Layers size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">IssuePilot</h1>
        </div>

        <button className="flex w-full items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm font-medium transition hover:bg-white/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-purple-600 text-xs font-bold">
              A
            </span>
            <span className="truncate">Acme Workspace</span>
          </div>
          <ChevronDown className="text-gray-400" size={16} />
        </button>

        <nav className="flex flex-col gap-1.5">
          <Link
            href="/workspaces"
            className="flex items-center gap-3 rounded-xl bg-[#1a2347] px-3.5 py-2.5 text-sm font-medium text-white shadow-sm"
          >
            <HomeIcon size={18} className="text-indigo-400" />
            <span>Overview</span>
          </Link>

          <Link
            href="/projects"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <FolderClosedIcon size={18} />
            <span>Projects</span>
          </Link>

          <Link
            href="/members"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <UsersIcon size={18} />
            <span>Members</span>
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            <SettingsIcon size={18} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      <div className="border-t border-white/10 pt-3">
        <button className="flex w-full items-center justify-between rounded-xl p-1.5 hover:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-xs font-bold">
              JD
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold">Jane Doe</span>
              <span className="text-[11px] text-gray-400">jane@acme.com</span>
            </div>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
