"use client";

import { cityTreeOptions } from "@features/search/api/search.options";
import { useQuery } from "@tanstack/react-query";

export const useCityTree = (enabled = true) =>
  useQuery({ ...cityTreeOptions(), enabled });
