import { defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const shouldRetryQuery = (failureCount: number, error: unknown) => {
  if (failureCount >= 1) return false;

  const candidate = error as {
    code?: string;
    httpStatus?: number;
    response?: { status?: number };
  };
  const status = candidate?.httpStatus ?? candidate?.response?.status;
  const isNetworkFailure = [
    "ECONNABORTED",
    "ERR_NETWORK",
    "ETIMEDOUT",
  ].includes(candidate?.code ?? "");

  return isNetworkFailure || Boolean(status && status >= 500);
};

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: GC_TIME.DEFAULT,
        staleTime: STALE_TIME.DEFAULT,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: shouldRetryQuery,
      },
      mutations: { retry: false },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });

const getQueryClient = cache(makeQueryClient);

export default getQueryClient;
