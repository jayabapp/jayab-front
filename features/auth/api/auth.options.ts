import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { queryOptions } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { authKeys } from "./auth.keys";

export const otpChallengeOptions = () =>
  queryOptions({
    queryKey: authKeys.otpChallenge(),
    queryFn: ({ signal }) => AuthService.getOtpChallenge({ signal }),
    staleTime: STALE_TIME.REALTIME,
    gcTime: GC_TIME.IMMEDIATE,
    retry: false,
  });

export const currentProfileOptions = (enabled = true) =>
  queryOptions({
    queryKey: authKeys.profile(),
    queryFn: ({ signal }) => AuthService.getProfile({ signal }),
    enabled,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const ownerProfileOptions = (enabled = true) =>
  queryOptions({
    queryKey: authKeys.ownerProfile(),
    queryFn: ({ signal }) => AuthService.getOwnerProfile({ signal }),
    enabled,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const authInitOptions = (enabled = true) =>
  queryOptions({
    queryKey: authKeys.init(),
    queryFn: ({ signal }) => AuthService.getAuthInit({ signal }),
    enabled,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });
