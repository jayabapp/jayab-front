"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { propertyAuthorizationOptions } from "../api/owner-property.options";
import { ownerPropertyKeys } from "../api/owner-property.keys";
import { PropertyService } from "@/api_services/property/property.service";

export const usePropertyAuthorization = (id: string | number) => {
  const client = useQueryClient();
  const query = useQuery(propertyAuthorizationOptions(id));
  const invalidate = () =>
    client.invalidateQueries({ queryKey: ownerPropertyKeys.authorization(id) });
  const request = useMutation({
    mutationFn: PropertyService.RequestSingleOwnerPropertyAuth,
    onSuccess: invalidate,
  });
  const edit = useMutation({
    mutationFn: PropertyService.EditRequestSingleOwnerPropertyAuth,
    onSuccess: invalidate,
  });
  return { ...query, request, edit };
};
