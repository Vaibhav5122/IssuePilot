import { apiClient } from "@/lib/api/axios-client";
import { useQuery } from "@tanstack/react-query";

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
