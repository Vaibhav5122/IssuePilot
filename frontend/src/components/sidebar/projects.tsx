"use client";

import { FolderClosedIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Projects = () => {
  const pathname = usePathname();
  const params = useParams();
  const memberId = params?.memberId as string | undefined;

  const href = memberId ? `/workspaces/${memberId}/projects` : "/projects";
  const isActive = pathname === "/projects" || pathname.startsWith("/projects");

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-[#1a2347] text-white shadow-sm"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <FolderClosedIcon
        size={18}
        className={isActive ? "text-indigo-400" : ""}
      />
      <span>Projects</span>
    </Link>
  );
};

export default Projects;
