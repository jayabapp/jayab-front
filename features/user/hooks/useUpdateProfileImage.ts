"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api_services/user/user.service";
import { authKeys } from "@features/auth/api/auth.keys";

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserService.updateProfileImage,
    onSuccess: (profile) => {
      if (!profile) return;
      queryClient.setQueryData(authKeys.profile(), profile);
    },
  });
};
