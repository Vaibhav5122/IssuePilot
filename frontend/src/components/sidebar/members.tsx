"use client";
import { UsersIcon } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const Members = () => {
  const params = useParams();
  const pathname = usePathname();
  const memberId = params.memberId as string;

  return (
    <Link
      href={`/workspaces/${memberId}/members`}
      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-white/5 hover:text-white ${pathname === `workspaces/${memberId}/members` ? "bg-[#1a2347] text-white " : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
    >
      <UsersIcon size={18} />
      <span>Members</span>
    </Link>
  );
};

export default Members;
