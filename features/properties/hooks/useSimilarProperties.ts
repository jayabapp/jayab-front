"use client";

import { similarPropertiesOptions } from "@features/properties/api/property.options";
import { useQuery } from "@tanstack/react-query";

export const useSimilarProperties = (id: number | string, enabled = true) =>
  useQuery(similarPropertiesOptions(id, enabled));
