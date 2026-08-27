"use client";
import { useQuery } from "@tanstack/react-query";
import { homeBannersOptions } from "@features/home/api/home.options";
import { BannerPosition } from "@/enum/banners.enum";
export const useAdvisorBanners = () => useQuery(homeBannersOptions([BannerPosition.Advisor]));
