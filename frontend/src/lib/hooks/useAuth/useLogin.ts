import { apiClient } from "@/lib/api/axios-client";
import { saveToken } from "@/lib/auth/token";
import { LoginFormValues } from "@/lib/validations/authValidation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin() {
  return useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const res = await apiClient.post("/auth/login", {
        email: values.email,
        password: values.password,
      });
      console.log(res.data);

      return res.data;
    },
    onSuccess: (data) => {
      if (data?.data?.token) {
        saveToken(data.data.token);
      }
      toast.success("Logged in successfully");
      //   reset();
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message || error.message;
      toast.error(backendMessage);
    },
  });
}
