export type Bbox = [west: number, south: number, east: number, north: number];

export const BBOX_PARAM = "bbox";
export const BBOX_MAX_LATITUDE = 85;
export const BBOX_MAX_LONGITUDE = 180;
export const MAP_MIN_ZOOM = 2;
export const MAP_MAX_ZOOM = 19;

const DECIMAL = /^-?\d+(\.\d+)?$/;

export const parseBbox = (raw: unknown): Bbox | null => {
  if (typeof raw !== "string") return null;
  const parts = raw.split(",").map((part) => part.trim());
  if (parts.length !== 4 || !parts.every((part) => DECIMAL.test(part)))
    return null;
  const [west, south, east, north] = parts.map(Number);
  if (
    Math.abs(west) > BBOX_MAX_LONGITUDE ||
    Math.abs(east) > BBOX_MAX_LONGITUDE
  )
    return null;
  if (
    Math.abs(south) > BBOX_MAX_LATITUDE ||
    Math.abs(north) > BBOX_MAX_LATITUDE
  )
    return null;
  if (west >= east || south >= north) return null;
  return [west, south, east, north];
};

const COORDINATE_SCALE = 1e4;

const scaled = (value: number) =>
  Number((value * COORDINATE_SCALE).toPrecision(12));

const roundedDown = (value: number) =>
  Math.floor(scaled(value)) / COORDINATE_SCALE;
const roundedUp = (value: number) =>
  Math.ceil(scaled(value)) / COORDINATE_SCALE;

const clamp = (value: number, limit: number) =>
  Math.min(limit, Math.max(-limit, value));

export const formatBbox = ([west, south, east, north]: Bbox): string =>
  [
    clamp(roundedDown(west), BBOX_MAX_LONGITUDE),
    clamp(roundedDown(south), BBOX_MAX_LATITUDE),
    clamp(roundedUp(east), BBOX_MAX_LONGITUDE),
    clamp(roundedUp(north), BBOX_MAX_LATITUDE),
  ].join(",");

export const canonicalBbox = (raw: unknown): string | null => {
  const box = parseBbox(raw);
  return box ? formatBbox(box) : null;
};

export const hasUsableBbox = (filters: Record<string, unknown>): boolean =>
  filters[BBOX_PARAM] === undefined ||
  parseBbox(filters[BBOX_PARAM]) !== null;

export const clampMapZoom = (zoom: number): number =>
  Math.min(
    MAP_MAX_ZOOM,
    Math.max(MAP_MIN_ZOOM, Math.round(zoom) || MAP_MIN_ZOOM),
  );

export const isPointLikeBbox = ([west, south, east, north]: Bbox): boolean =>
  east - west < 1e-5 && north - south < 1e-5;

export const padBbox = (
  [west, south, east, north]: Bbox,
  amount: number,
): Bbox => [west - amount, south - amount, east + amount, north + amount];
