import { AuthService } from "@/api_services/auth/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useForgotPassword = () => {
  const sendCode = useMutation({ mutationFn: AuthService.sendForgetOtp });
  const verifyCode = useMutation({ mutationFn: AuthService.confirmForgetOtp });
  return { sendCode, verifyCode };
};
