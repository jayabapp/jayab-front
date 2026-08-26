"use client";

import { propertyDetailOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

export const usePropertyDetails = (slug: string) => {
  const query = useQuery(propertyDetailOptions(slug));
  return { ...query, property: query.data };
};
