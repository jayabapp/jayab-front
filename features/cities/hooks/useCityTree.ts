"use client";

import { cityTreeOptions } from "@features/cities/api/cities.options";
import { useQuery } from "@tanstack/react-query";

/**
 * The province/city tree is a single long-lived cache entry shared by every city
 * picker on the page, so opening a second modal reuses the first response instead
 * of issuing a second request.
 */
export const useCityTree = (enabled = true) =>
  useQuery({ ...cityTreeOptions(), enabled });
