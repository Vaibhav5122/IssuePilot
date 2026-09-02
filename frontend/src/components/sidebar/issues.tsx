"use client";

import { Kanban } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Issues = () => {
  const pathname = usePathname();
  const isActive = pathname.startsWith("/issues");

  return (
    <Link
      href="/issues"
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Kanban size={18} className={isActive ? "text-primary-foreground" : ""} />
      <span>Issues</span>
    </Link>
  );
};

export default Issues;
