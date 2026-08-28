import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { authKeys } from "../api/auth.keys";

export const useRegisterOwner = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AuthService.registerOwner,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: authKeys.profile() }),
        queryClient.invalidateQueries({ queryKey: authKeys.ownerProfile() }),
        queryClient.invalidateQueries({ queryKey: authKeys.init() }),
      ]),
  });
};
