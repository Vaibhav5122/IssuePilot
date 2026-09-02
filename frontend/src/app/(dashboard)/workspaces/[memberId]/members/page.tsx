"use client";

import { use } from "react";
import MembersPage from "@/app/(dashboard)/members/page";

export default function WorkspaceMembersPage({ params }: { params: Promise<{ memberId: string }> }) {
  // Read params for workspaceId
  use(params);
  return <MembersPage />;
}
