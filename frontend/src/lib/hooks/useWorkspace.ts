"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { toast } from "sonner";

export function useGetWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await apiClient.get("/workspaces");
      return response.data.data;
    },
  });
}

export function useGetWorkspaceById(workspaceId?: string | null) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      const response = await apiClient.get(`/workspaces/${workspaceId}`);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const response = await apiClient.post("/workspaces/create", payload);
      return response.data.data;
    },
    onSuccess: (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success(`Workspace "${newWorkspace?.name || 'New Workspace'}" created!`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create workspace";
      toast.error(msg);
    },
  });
}
