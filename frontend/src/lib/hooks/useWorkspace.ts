"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { getToken } from "@/lib/auth/token";
import { toast } from "sonner";

export function useGetWorkspaces() {
  const token = typeof window !== "undefined" ? getToken() : null;

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      if (!token) return [];
      const response = await apiClient.get("/workspaces");
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
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
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; description?: string }) => {
      const response = await apiClient.post("/workspaces/create", payload);
      const resData = response.data?.data;
      return resData?.data || resData || response.data;
    },
    onSuccess: async (data: any) => {
      const ws = data?.workspace || data;
      // Invalidate and immediately refetch fresh workspaces list
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await queryClient.refetchQueries({ queryKey: ["workspaces"] });
      toast.success(`Workspace "${ws?.name || 'New Workspace'}" created!`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create workspace";
      toast.error(msg);
    },
  });
}
