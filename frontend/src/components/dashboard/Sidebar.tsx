"use client";

import { ChevronDown, Layers } from "lucide-react";
import Overview from "../sidebar/overview";
import Workspaces from "../sidebar/workspaces";
import Projects from "../sidebar/projects";
import Members from "../sidebar/members";
import Settings from "../sidebar/settings";

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
          <Overview />
          <Workspaces />
          <Projects />
          <Members />
          <Settings />
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
