"use client";

import { photoUpgradeRequestsOptions } from "../api/photo-upgrade.options";
import { useQuery } from "@tanstack/react-query";

import type { PhotoUpgradeFilters } from "../api/photo-upgrade.keys";

export const usePhotoUpgradeRequests = (filters: PhotoUpgradeFilters = {}) =>
  useQuery(photoUpgradeRequestsOptions(filters));
