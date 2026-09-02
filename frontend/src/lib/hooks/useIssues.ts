"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { toast } from "sonner";

export interface IssueFilterParams {
  search?: string;
  status?: string;
  priority?: string;
  type?: string;
  assigneeId?: string;
}

export function useGetIssues(
  workspaceId?: string | null,
  projectId?: string | null,
  filters?: IssueFilterParams
) {
  return useQuery({
    queryKey: ["issues", workspaceId, projectId, filters],
    queryFn: async () => {
      if (!workspaceId || !projectId) return [];
      const params = new URLSearchParams();
      if (filters?.search) params.append("search", filters.search);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.priority) params.append("priority", filters.priority);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.assigneeId) params.append("assigneeId", filters.assigneeId);

      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await apiClient.get(
        `/issues/workspaces/${workspaceId}/projects/${projectId}/issues${queryString}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!projectId,
  });
}

export function useGetIssueById(
  workspaceId?: string | null,
  projectId?: string | null,
  issueId?: string | null
) {
  return useQuery({
    queryKey: ["issue", workspaceId, projectId, issueId],
    queryFn: async () => {
      if (!workspaceId || !projectId || !issueId) return null;
      const response = await apiClient.get(
        `/issues/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!projectId && !!issueId,
  });
}

export function useCreateIssue(
  workspaceId?: string | null,
  projectId?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description?: string;
      status?: string;
      priority?: string;
      type?: string;
      assigneeId?: string;
      dueDate?: string;
    }) => {
      if (!workspaceId || !projectId) throw new Error("Workspace and Project ID required");
      const response = await apiClient.post(
        `/issues/workspaces/${workspaceId}/projects/${projectId}/issues`,
        payload
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", workspaceId, projectId] });
      toast.success("Issue created successfully!");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create issue";
      toast.error(msg);
    },
  });
}

export function useUpdateIssue(
  workspaceId?: string | null,
  projectId?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      issueId,
      payload,
    }: {
      issueId: string;
      payload: Partial<{
        title: string;
        description: string;
        status: string;
        priority: string;
        type: string;
        assigneeId: string;
        dueDate: string;
      }>;
    }) => {
      if (!workspaceId || !projectId) throw new Error("Workspace and Project ID required");
      const response = await apiClient.patch(
        `/issues/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}`,
        payload
      );
      return response.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["issues", workspaceId, projectId] });
      queryClient.invalidateQueries({ queryKey: ["issue", workspaceId, projectId, variables.issueId] });
      queryClient.invalidateQueries({ queryKey: ["issue-activity", workspaceId, projectId, variables.issueId] });
      toast.success("Issue updated");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update issue";
      toast.error(msg);
    },
  });
}

export function useDeleteIssue(
  workspaceId?: string | null,
  projectId?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issueId: string) => {
      if (!workspaceId || !projectId) throw new Error("Workspace and Project ID required");
      const response = await apiClient.delete(
        `/issues/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}`
      );
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", workspaceId, projectId] });
      toast.success("Issue deleted");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to delete issue";
      toast.error(msg);
    },
  });
}

export function useGetIssueActivity(
  workspaceId?: string | null,
  projectId?: string | null,
  issueId?: string | null
) {
  return useQuery({
    queryKey: ["issue-activity", workspaceId, projectId, issueId],
    queryFn: async () => {
      if (!workspaceId || !projectId || !issueId) return [];
      const response = await apiClient.get(
        `/issues/workspaces/${workspaceId}/projects/${projectId}/issues/${issueId}/activity`
      );
      return response.data.data;
    },
    enabled: !!workspaceId && !!projectId && !!issueId,
  });
}
