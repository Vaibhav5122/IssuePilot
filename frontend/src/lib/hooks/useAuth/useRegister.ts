import { apiClient } from "@/lib/api/axios-client";
import { RegisterFormValues } from "@/lib/validations/authValidation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useRegister() {
  return useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const response = await apiClient.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      console.log(response.data);

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any) => {
      const backendMessage = error.response?.data?.message || error.message;
      toast.error(backendMessage);
    },
  });
}
