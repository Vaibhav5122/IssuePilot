import { apiClient } from "@/lib/api/axios-client";
import { getToken } from "@/lib/auth/token";
import { useQuery } from "@tanstack/react-query";

export function useGetWorkspace() {
  const token = getToken();

  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await apiClient.get(`/workspaces`);
      console.log(response.data);
      return response.data.data;
    },
  });
}
