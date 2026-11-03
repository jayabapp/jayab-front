export const DISCOVERY_MAP_ENABLED =
  process.env.NEXT_PUBLIC_DISCOVERY_MAP_ENABLED === "true" &&
  Boolean(process.env.NEXT_PUBLIC_NESHAN_MAP_KEY);

export const MAP_MOVE_DEBOUNCE_MS = 400;

export const DISCOVERY_MAP_COLUMN_QUERY = "(min-width: 1024px)";

export const CLUSTER_MAX_FIT_ZOOM = 18;
