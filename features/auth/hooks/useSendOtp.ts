import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { authKeys } from "../api/auth.keys";
import { useRef } from "react";

export const useSendOtp = () => {
  const queryClient = useQueryClient();
  const latestRequestRef = useRef(0);

  return useMutation({
    mutationFn: async (mobileNumber?: string) => {
      const requestId = ++latestRequestRef.current;
      const challenge = await AuthService.sendOtp({
        mobile_number: mobileNumber ?? null,
      });
      return { challenge, requestId };
    },
    onSuccess: ({ challenge, requestId }) => {
      if (requestId === latestRequestRef.current && challenge) {
        queryClient.setQueryData(authKeys.otpChallenge(), challenge);
      }
    },
  });
};
