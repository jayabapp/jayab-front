export type Bbox = [west: number, south: number, east: number, north: number];

export const BBOX_MAX_LATITUDE = 85;
export const BBOX_MAX_LONGITUDE = 180;

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

const COORDINATE_DECIMALS = 5;

export const formatBbox = (bbox: Bbox): string =>
  bbox.map((value) => Number(value.toFixed(COORDINATE_DECIMALS))).join(",");
