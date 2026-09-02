"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { toast } from "sonner";

export function useGetWorkspaceMembers(workspaceId?: string | null) {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await apiClient.get(`/workspaces/${workspaceId}/members`);
      return response.data.data;
    },
    enabled: !!workspaceId,
  });
}

export function useAddWorkspaceMember(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { userEmail: string; role?: "ADMIN" | "MEMBER" }) => {
      if (!workspaceId) throw new Error("Workspace ID is required");
      const response = await apiClient.post(`/workspaces/${workspaceId}/members`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
      toast.success("Member added to workspace!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to add member";
      toast.error(msg);
    },
  });
}

export function useUpdateMemberRole(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: "ADMIN" | "MEMBER" }) => {
      if (!workspaceId) throw new Error("Workspace ID is required");
      const response = await apiClient.patch(
        `/workspaces/${workspaceId}/members/${memberId}`,
        { role }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Member role updated");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update member role";
      toast.error(msg);
    },
  });
}

export function useRemoveWorkspaceMember(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      if (!workspaceId) throw new Error("Workspace ID is required");
      const response = await apiClient.delete(
        `/workspaces/${workspaceId}/members/${memberId}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members", workspaceId] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Member removed from workspace");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to remove member";
      toast.error(msg);
    },
  });
}
