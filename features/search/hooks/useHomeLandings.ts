"use client";

import { homeLandingsOptions } from "@features/home/api/home.options";
import { LandingsPlacements } from "@/enum/landings.enum";
import { useQuery } from "@tanstack/react-query";

export const useHomeLandings = () =>
  useQuery(homeLandingsOptions(LandingsPlacements.HOME));
