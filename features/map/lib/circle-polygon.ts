import type { Feature, Polygon } from "geojson";

const METERS_PER_DEGREE = 111_320;
const CIRCLE_STEPS = 64;

export const circlePolygon = (
  lng: number,
  lat: number,
  radiusMeters: number,
): Feature<Polygon> => {
  const dLat = radiusMeters / METERS_PER_DEGREE;
  const dLng = dLat / Math.cos((lat * Math.PI) / 180);
  const ring: [number, number][] = [];
  for (let step = 0; step <= CIRCLE_STEPS; step++) {
    const angle = (step / CIRCLE_STEPS) * 2 * Math.PI;
    ring.push([lng + dLng * Math.cos(angle), lat + dLat * Math.sin(angle)]);
  }
  return {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [ring] },
  };
};
