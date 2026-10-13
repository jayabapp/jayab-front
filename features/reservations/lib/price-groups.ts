import type { PropertyQuoteDto } from "@/api_services/property/property.interface";

/** Combine every night with the same payable rate, preserving first appearance. */
export const groupNightsByPrice = (
  nights: PropertyQuoteDto["nights_breakdown"],
) => {
  const groups = new Map<number, { count: number; price: number }>();
  for (const night of nights) {
    const group = groups.get(night.final_price);
    if (group) group.count += 1;
    else groups.set(night.final_price, { count: 1, price: night.final_price });
  }
  return Array.from(groups.values());
};
