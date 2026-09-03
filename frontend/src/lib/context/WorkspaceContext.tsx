"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetWorkspaces } from "@/lib/hooks/useWorkspace";

const STORAGE_KEY = "issuepilot_active_workspace_id";

export interface WorkspaceContextType {
  activeWorkspaceId: string | null;
  activeWorkspace: any | null;
  activeMemberRole: "ADMIN" | "MEMBER" | null;
  workspaces: any[] | undefined;
  isLoadingWorkspaces: boolean;
  setActiveWorkspaceId: (id: string | null) => void;
  refetchWorkspaces: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined,
);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const {
    data: workspaces,
    isLoading: isLoadingWorkspaces,
    refetch: refetchWorkspaces,
  } = useGetWorkspaces();

  // Initialize to null for SSR/client hydration consistency
  const [activeWorkspaceId, setActiveWorkspaceIdState] = useState<string | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setActiveWorkspaceIdState(stored);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Sync across different browser tabs/windows
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setActiveWorkspaceIdState(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // When workspaces list loads or changes, verify that the active workspace still exists
  useEffect(() => {
    if (!workspaces || workspaces.length === 0) return;

    if (activeWorkspaceId) {
      const exists = workspaces.some((w: any) => {
        const id = w.workspace?._id || w.workspace?.id;
        return id === activeWorkspaceId;
      });

      if (!exists) {
        // Workspace was deleted or user was removed - fallback to first workspace
        const firstId = workspaces[0]?.workspace?._id || workspaces[0]?.workspace?.id || null;
        setActiveWorkspaceIdState(firstId);
        if (typeof window !== "undefined") {
          if (firstId) {
            localStorage.setItem(STORAGE_KEY, firstId);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      }
    } else {
      // If no active workspace is selected yet, automatically select the first one
      const firstId = workspaces[0]?.workspace?._id || workspaces[0]?.workspace?.id || null;
      if (firstId) {
        setActiveWorkspaceIdState(firstId);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, firstId);
        }
      }
    }
  }, [workspaces, activeWorkspaceId]);

  // Global setter that updates state, localStorage, and invalidates stale caches
  const setActiveWorkspaceId = useCallback(
    (id: string | null) => {
      setActiveWorkspaceIdState(id);
      if (typeof window !== "undefined") {
        if (id) {
          localStorage.setItem(STORAGE_KEY, id);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Invalidate and refetch relevant queries so all components fetch fresh data
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["members", id] });
        queryClient.invalidateQueries({ queryKey: ["projects", id] });
        queryClient.invalidateQueries({ queryKey: ["issues"] });
        queryClient.invalidateQueries({ queryKey: ["comments"] });
        queryClient.refetchQueries({ queryKey: ["members", id] });
        queryClient.refetchQueries({ queryKey: ["projects", id] });
      }
    },
    [queryClient],
  );

  // Find active workspace object & role
  const activeItem = useMemo(() => {
    if (!activeWorkspaceId || !workspaces) return null;
    return workspaces.find((w: any) => {
      const id = w.workspace?._id || w.workspace?.id;
      return id === activeWorkspaceId;
    });
  }, [workspaces, activeWorkspaceId]);

  const activeWorkspace = activeItem?.workspace || null;
  const activeMemberRole = activeItem?.role || null;

  const value = useMemo(
    () => ({
      activeWorkspaceId,
      activeWorkspace,
      activeMemberRole,
      workspaces,
      isLoadingWorkspaces,
      setActiveWorkspaceId,
      refetchWorkspaces,
    }),
    [
      activeWorkspaceId,
      activeWorkspace,
      activeMemberRole,
      workspaces,
      isLoadingWorkspaces,
      setActiveWorkspaceId,
      refetchWorkspaces,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useActiveWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useActiveWorkspace must be used within a WorkspaceProvider",
    );
  }
  return context;
}
