import { apiClient } from "@/lib/api/axios-client";
import {
  AddWorkspaceMember,
  AddWorkspaceMemberRole,
} from "@/lib/validations/workspaceValidation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetWorkspaceMembers(memberId: string) {
  console.log(memberId);
  return useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await apiClient.get(`/workspaces/${memberId}/members`);
      //   console.log("resssss", response.data.data);
      return response.data.data;
    },
    // enabled: !!memberId,
  });
}

export function usePostCreateMembers(memberId: string) {
  return useMutation({
    mutationFn: async (value: AddWorkspaceMember) => {
      const response = await apiClient.post(`/workspaces/${memberId}/members`, {
        email: value.email,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Workspace Created");
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message || error.message;
      toast.error(backendMessage);
    },
  });
}
export function usePatchUpdateMembers(memberId: string) {
  return useMutation({
    mutationFn: async (value: AddWorkspaceMemberRole) => {
      const response = await apiClient.patch(
        `/workspaces/${memberId}/members/${memberId}`,
        {
          role: value.role,
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Role Updated to ${data.role}`);
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message || error.message;
      toast.error(backendMessage);
    },
  });
}
