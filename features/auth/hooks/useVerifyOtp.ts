import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { authInitOptions, currentProfileOptions } from "../api/auth.options";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { authKeys } from "../api/auth.keys";
import { useRef } from "react";

import type { SendOtpVerify } from "@/api_services/auth/auth.interface";

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  const submissionLockRef = useRef(false);
  const mutation = useMutation({
    mutationFn: AuthService.confirmOtp,
    onSuccess: (result) => {
      queryClient.removeQueries({ queryKey: authKeys.otpChallenge() });
      if (result?.needs_registration) return;
      useAuthStore.setState({ isLogin: true });

      void queryClient
        .fetchQuery(currentProfileOptions())
        .then((profile) => {
          if (profile) useStoreInit.setState({ userInfo: profile });
        })
        .catch(() => undefined);

      void queryClient
        .fetchQuery(authInitOptions())
        .then((init) => {
          if (!init) return;
          useStoreParams.setState({
            bookmarks: init.bookmarks ?? [],
            likes: init.favorites ?? [],
            isAdvisor: init.isValidAdvisor?.isAdvisor ?? false,
          });
        })
        .catch(() => undefined);
    },
    onSettled: () => {
      submissionLockRef.current = false;
    },
    retry: false,
  });

  const verify = (
    dto: SendOtpVerify,
    options?: Parameters<typeof mutation.mutate>[1],
  ) => {
    if (submissionLockRef.current) return;
    submissionLockRef.current = true;
    mutation.mutate(dto, options);
  };

  return { ...mutation, verify };
};
