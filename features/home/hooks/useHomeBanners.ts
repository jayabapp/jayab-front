"use client";

import { homeBannersOptions } from "@features/home/api/home.options";
import { useQuery } from "@tanstack/react-query";

import type { BannerPosition } from "@/enum/banners.enum";

export const useHomeBanners = (positions: BannerPosition[]) =>
  useQuery(homeBannersOptions(positions));
