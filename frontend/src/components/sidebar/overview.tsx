"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Overview = () => {
  const pathname = usePathname();
  const isActive = pathname === "/overview";

  return (
    <Link
      href="/overview"
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <HomeIcon size={18} className={isActive ? "text-primary-foreground" : ""} />
      <span>Overview</span>
    </Link>
  );
};

export default Overview;
