"use client";

import { useAuthStore, useStoreParams } from "@/store";
import { ownerPropertyStepRoute } from "../lib/property-step-routes";
import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

export const useCreatePropertyEntry = (options?: {
  loginModalCancelRoute?: string;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLogin } = useAuthStore((state) => state);
  const { data: profile } = useCurrentProfile(Boolean(isLogin));

  const { mutate, isPending } = useMutation({
    mutationFn: () => PropertyService.InitProperty({ property_id: undefined }),
    onSuccess: (draft) => {
      if (!draft?.id) return;
      queryClient.setQueryData(ownerPropertyKeys.draft(draft.id), draft);
      router.push(ownerPropertyStepRoute(draft.id, "initials"));
    },
  });

  const start = useCallback(() => {
    if (!isLogin) {
      useStoreParams.setState({
        loginModal: true,
        loginModalCancelRoute: options?.loginModalCancelRoute,
      });
      return;
    }
    if (!profile || isPending) return;
    if (!profile?.owner_id) {
      router.push("/profile/edit");
      return;
    }
    mutate();
  }, [isLogin, isPending, mutate, options?.loginModalCancelRoute, profile, router]);
  return { start, isPending };
};
