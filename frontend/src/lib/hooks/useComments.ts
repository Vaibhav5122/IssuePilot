"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { toast } from "sonner";

export function useGetComments(
  workspaceId?: string | null,
  projectId?: string | null,
  issueId?: string | null
) {
  return useQuery({
    queryKey: ["comments", workspaceId, projectId, issueId],
    queryFn: async () => {
      if (!workspaceId || !projectId || !issueId) return [];
      const response = await apiClient.get(
        `/comments/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}/comments`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!projectId && !!issueId,
  });
}

export function useCreateComment(
  workspaceId?: string | null,
  projectId?: string | null,
  issueId?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!workspaceId || !projectId || !issueId) {
        throw new Error("Missing parameters for comment creation");
      }
      const response = await apiClient.post(
        `/comments/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}/comments`,
        { content }
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", workspaceId, projectId, issueId],
      });
      toast.success("Comment added!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to post comment";
      toast.error(msg);
    },
  });
}

export function useDeleteComment(
  workspaceId?: string | null,
  projectId?: string | null,
  issueId?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      if (!workspaceId || !projectId || !issueId) {
        throw new Error("Missing parameters for comment deletion");
      }
      const response = await apiClient.delete(
        `/comments/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}/comments/${commentId}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", workspaceId, projectId, issueId],
      });
      toast.success("Comment deleted");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to delete comment";
      toast.error(msg);
    },
  });
}
