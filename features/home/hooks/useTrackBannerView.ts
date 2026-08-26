"use client";

import { useMutation } from "@tanstack/react-query";
import { HomeService } from "@/api_services/home/home.service";

export const useTrackBannerView = () =>
  useMutation({ mutationFn: HomeService.updateBannerViewCount });
