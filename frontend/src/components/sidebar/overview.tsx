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
          ? "bg-[#1a2347] text-white shadow-sm"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <HomeIcon size={18} className={isActive ? "text-indigo-400" : ""} />
      <span>Overview</span>
    </Link>
  );
};

export default Overview;
