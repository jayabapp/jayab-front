import { queryOptions } from "@tanstack/react-query";
import { TestAccessService } from "@/api_services/test-access/test-access.service";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { testAccessKeys } from "./test-access.keys";

export const testAccessMeOptions = (enabled = true) =>
  queryOptions({
    queryKey: testAccessKeys.me(),
    queryFn: ({ signal }) => TestAccessService.getMe({ signal }),
    enabled,
    retry: false,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });

export const testAccessMembersOptions = (enabled = true) =>
  queryOptions({
    queryKey: testAccessKeys.members(),
    queryFn: ({ signal }) => TestAccessService.getMembers({ signal }),
    enabled,
    retry: false,
    staleTime: STALE_TIME.SHORT,
    gcTime: GC_TIME.DEFAULT,
  });
