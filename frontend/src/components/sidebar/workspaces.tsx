"use client";

import { FileBarChart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Workspaces = () => {
  const pathname = usePathname();
  const isActive = pathname === "/workspaces";

  return (
    <Link
      href="/workspaces"
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <FileBarChart size={18} className={isActive ? "text-primary-foreground" : ""} />
      <span>Workspaces</span>
    </Link>
  );
};

export default Workspaces;
