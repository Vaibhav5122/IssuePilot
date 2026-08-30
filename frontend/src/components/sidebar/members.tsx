"use client";

import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useGetWorkspace } from "@/lib/hooks/useWorkspace/useGetWorkspace";
import { useGetWorkspaceMembers } from "@/lib/hooks/useMembers/useMembers";

const Members = () => {
  const params = useParams();
  const pathname = usePathname();
  const { data: workspaces } = useGetWorkspace();

  //get members

  const memberId =
    (params?.memberId as string | undefined) || workspaces?.[0]?.workspace?.id;
  console.log(memberId);

  const href = memberId ? `/workspaces/${memberId}/members` : "/members";
  const isActive = pathname.includes("/members");
  console.log("eeeee", href);

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-[#1a2347] text-white shadow-sm"
          : "text-gray-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <UsersIcon size={18} className={isActive ? "text-indigo-400" : ""} />
      <span>Members</span>
    </Link>
  );
};

export default Members;
