import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { authKeys } from "../api/auth.keys";

import type { UpdateProfileDto } from "@/api_services/auth/auth.interface";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => AuthService.updateProfile(dto),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: authKeys.profile() }),
        queryClient.invalidateQueries({ queryKey: authKeys.ownerProfile() }),
      ]),
  });
};
