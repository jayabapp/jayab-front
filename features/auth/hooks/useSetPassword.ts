import { AuthService } from "@/api_services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useSetPassword = () => {
  const setPassword = useMutation({ mutationFn: AuthService.setUserPassword });
  const resetPassword = useMutation({ mutationFn: AuthService.setNewPassword });
  return { resetPassword, setPassword };
};
