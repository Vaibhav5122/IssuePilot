"use client";

import { FileBarChart } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Workspaces = () => {
  const pathname = usePathname();
  const params = useParams();
  const memberId = params?.memberId as string | undefined;

  const href = memberId ? `/workspaces/${memberId}` : "/workspaces";
  const isActive =
    pathname === "/workspaces" ||
    (pathname.startsWith("/workspaces") && !pathname.includes("/members"));

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-[#1a2347] text-white shadow-sm"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <FileBarChart size={18} className={isActive ? "text-indigo-400" : ""} />
      <span>Workspaces</span>
    </Link>
  );
};

export default Workspaces;
