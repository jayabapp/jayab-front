"use client";

import { homeLandingsOptions } from "@features/home/api/home.options";
import { LandingsPlacements } from "@/enum/landings.enum";
import { resolveLocale } from "@/i18n/config";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";

export const useHomeLandings = () => {
  const locale = resolveLocale(useLocale());
  return useQuery(homeLandingsOptions(LandingsPlacements.HOME, locale));
};
