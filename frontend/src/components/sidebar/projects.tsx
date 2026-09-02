"use client";

import { FolderClosedIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Projects = () => {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/projects");

  return (
    <Link
      href="/projects"
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <FolderClosedIcon size={18} className={isActive ? "text-primary-foreground" : ""} />
      <span>Projects</span>
    </Link>
  );
};

export default Projects;
