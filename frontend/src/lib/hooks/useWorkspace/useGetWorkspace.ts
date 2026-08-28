import { apiClient } from "@/lib/api/axios-client";
import { getToken } from "@/lib/auth/token";
import { useMutation, useQuery } from "@tanstack/react-query";

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
        mutationFn:async(values)=>{}
    })
}
