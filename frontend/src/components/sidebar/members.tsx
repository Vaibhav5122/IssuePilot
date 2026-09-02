"use client";

import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Members = () => {
  const pathname = usePathname();
  const isActive = pathname.includes("/members");

  return (
    <Link
      href="/members"
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-primary text-primary-foreground shadow-xs"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <UsersIcon size={18} className={isActive ? "text-primary-foreground" : ""} />
      <span>Members</span>
    </Link>
  );
};

export default Members;
