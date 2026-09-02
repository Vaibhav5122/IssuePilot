"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { toast } from "sonner";

export function useGetProjects(workspaceId?: string | null) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      if (!workspaceId) return [];
      const response = await apiClient.get(`/projects/workspaces/${workspaceId}/projects`);
      return response.data.data;
    },
    enabled: !!workspaceId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useGetProjectById(workspaceId?: string | null, projectId?: string | null) {
  return useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: async () => {
      if (!workspaceId || !projectId) return null;
      const response = await apiClient.get(`/projects/workspaces/${workspaceId}/projects/${projectId}`);
      return response.data.data;
    },
    enabled: !!workspaceId && !!projectId,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 30,
  });
}

export function useCreateProject(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; key: string; description?: string }) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const response = await apiClient.post(`/projects/workspaces/${workspaceId}/projects`, payload);
      return response.data.data;
    },
    onSuccess: async (newProj) => {
      await queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      await queryClient.refetchQueries({ queryKey: ["projects", workspaceId] });
      toast.success(`Project "${newProj?.name || 'New Project'}" created!`);
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to create project";
      toast.error(msg);
    },
  });
}

export function useUpdateProject(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, payload }: { projectId: string; payload: { name?: string; key?: string; description?: string } }) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const response = await apiClient.patch(`/projects/workspaces/${workspaceId}/projects/${projectId}`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project updated");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to update project";
      toast.error(msg);
    },
  });
}

export function useDeleteProject(workspaceId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!workspaceId) throw new Error("Workspace ID required");
      const response = await apiClient.delete(`/projects/workspaces/${workspaceId}/projects/${projectId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
      toast.success("Project deleted");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Failed to delete project";
      toast.error(msg);
    },
  });
}
