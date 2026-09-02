"use client";

import { useActiveWorkspaceContext } from "@/lib/context/WorkspaceContext";

export function useActiveWorkspace() {
  return useActiveWorkspaceContext();
}
