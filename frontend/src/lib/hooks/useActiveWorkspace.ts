"use client";

import { useState, useEffect } from "react";
import { useGetWorkspaces } from "./useWorkspace";

const STORAGE_KEY = "issuepilot_active_workspace_id";

export function useActiveWorkspace() {
  const { data: workspaces, isLoading } = useGetWorkspaces();
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setActiveWorkspaceIdState(stored);
    }
  }, []);

  useEffect(() => {
    if (!workspaces || workspaces.length === 0) return;

    // Check if currently set ID is valid in fetched workspaces
    const exists = workspaces.some(
      (w: any) => (w.workspace?._id || w.workspace?.id) === activeWorkspaceId
    );

    if (!activeWorkspaceId || !exists) {
      const firstId = workspaces[0]?.workspace?._id || workspaces[0]?.workspace?.id;
      if (firstId) {
        setActiveWorkspaceIdState(firstId);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, firstId);
        }
      }
    }
  }, [workspaces, activeWorkspaceId]);

  const setActiveWorkspaceId = (id: string) => {
    setActiveWorkspaceIdState(id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  const activeWorkspace = workspaces?.find(
    (w: any) => (w.workspace?._id || w.workspace?.id) === activeWorkspaceId
  );

  return {
    activeWorkspaceId,
    activeWorkspace: activeWorkspace?.workspace,
    activeMemberRole: activeWorkspace?.role,
    workspaces,
    isLoadingWorkspaces: isLoading,
    setActiveWorkspaceId,
  };
}
