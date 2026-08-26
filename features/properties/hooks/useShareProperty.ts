"use client";

import { PropertyService } from "@/api_services/property/property.service";
import { useMutation } from "@tanstack/react-query";

export const useShareProperty = () =>
  useMutation({ mutationFn: PropertyService.getSingleAdvisorShare });
