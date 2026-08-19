import { REVALIDATE } from "./revalidate";

export const pickBanner = <T>(
  banners?: T[] | null,
  bucketSeconds: number = REVALIDATE.BANNERS,
): T | null => {
  if (!Array.isArray(banners) || banners.length === 0) return null;
  const bucket = Math.floor(Date.now() / (bucketSeconds * 1000));
  return banners[bucket % banners.length] ?? null;
};

export default pickBanner;
