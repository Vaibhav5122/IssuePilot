import { apiClient } from "@/lib/api/axios-client";
import { getToken } from "@/lib/auth/token";
import { WorkSpaceSchema } from "@/lib/validations/workspaceValidation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetWorkspace() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await apiClient.get(`/workspaces`);
      console.log(response.data);
      return response.data.data;
    },
  });
}

export function usePostCreateWorkspace() {
  return useMutation({
    mutationFn: async (values: WorkSpaceSchema) => {
      const response = await apiClient.post(`/workspaces/create`, {
        name: values.name,
        description: values.description,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Workspace Created workspace id:${data?._id}`);
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message || error.message;
      toast.error(backendMessage);
    },
  });
}
