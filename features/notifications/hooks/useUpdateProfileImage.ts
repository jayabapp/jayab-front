"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStoreInit } from "@/store";
import { AuthService } from "@/api_services/auth/auth.service";
import { UserService } from "@/api_services/user/user.service";

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserService.updateProfileImage,
    onSuccess: (profile) => {
      if (!profile) return;
      useStoreInit.setState({ userInfo: profile });
      queryClient.setQueriesData(
        { queryKey: [AuthService.GET_PROFILE_CACHEKEY] },
        profile,
      );
    },
  });
};
