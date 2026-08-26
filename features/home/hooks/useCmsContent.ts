"use client";

import { cmsContentOptions } from "@features/home/api/home.options";
import { useQuery } from "@tanstack/react-query";

export const useCmsContent = (key: string, options?: { enabled?: boolean }) => {
  const query = useQuery({
    ...cmsContentOptions(key),
    enabled: options?.enabled ?? true,
  });
  return { ...query, content: query.data };
};
