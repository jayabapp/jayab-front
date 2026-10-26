import type { QueryClient } from "@tanstack/react-query";

import { propertyKeys } from "./property.keys";

const DISCOVERY_QUERY_TYPES = new Set([
  "list",
  "count",
  "map",
  "map-preview",
  "price-histogram",
]);

export const cancelPropertyDiscoveryQueries = (client: QueryClient) => {
  void client.cancelQueries({
    predicate: ({ queryKey }) =>
      queryKey[0] === propertyKeys.all[0] &&
      DISCOVERY_QUERY_TYPES.has(String(queryKey[1])),
  });
};
