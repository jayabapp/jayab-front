"use client";

import { photoUpgradeRequestOptions } from "../api/photo-upgrade.options";
import { useQuery } from "@tanstack/react-query";

export const usePhotoUpgradeRequest = (id: number) =>
  useQuery(photoUpgradeRequestOptions(id));
