import { defaultShouldDehydrateQuery } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/helpers/queryCache";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        gcTime: GC_TIME.DEFAULT,
        staleTime: STALE_TIME.DEFAULT,
        refetchOnWindowFocus: false,
        retry: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });

const getQueryClient = cache(makeQueryClient);

export default getQueryClient;
