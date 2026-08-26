"use client";

import { PropertyService } from "@/api_services/property/property.service";
import { useMutation } from "@tanstack/react-query";

export const usePropertyContact = () =>
  useMutation({ mutationFn: PropertyService.getSinglePropertyContactInfo });
