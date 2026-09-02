"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/axios-client";
import { getToken, saveToken, removeToken } from "@/lib/auth/token";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUser() {
  const token = getToken();
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!token) return null;
      const response = await apiClient.get("/auth/me");
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: any) => {
      const response = await apiClient.post("/auth/login", values);
      return response.data;
    },
    onSuccess: async (data) => {
      if (data?.data?.token) {
        saveToken(data.data.token);
      }
      // Invalidate and refetch fresh user profile and workspaces on login
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      await Promise.allSettled([
        queryClient.refetchQueries({ queryKey: ["currentUser"] }),
        queryClient.refetchQueries({ queryKey: ["workspaces"] }),
      ]);
      toast.success("Welcome back! Signed in successfully.");
      router.push("/overview");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (values: any) => {
      const response = await apiClient.post("/auth/register", values);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created! Please sign in.");
      router.push("/login");
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("issuepilot_active_workspace_id");
      localStorage.removeItem("activeWorkspaceId");
    }
    queryClient.clear();
    toast.info("Logged out successfully");
    router.push("/login");
  };
}
