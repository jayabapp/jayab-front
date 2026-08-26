"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import { useStoreParams } from "@/store";
import { propertyKeys } from "@features/properties/api/property.keys";

const patchFavoriteCount = (
  value: unknown,
  propertyId: number,
  delta: number,
): unknown => {
  if (Array.isArray(value))
    return value.map((item) => patchFavoriteCount(item, propertyId, delta));
  if (value instanceof Date) return value;
  if (!value || typeof value !== "object") return value;

  const record = value as Record<string, unknown>;
  const patched =
    record.id === propertyId && typeof record.favorite_count === "number"
      ? {
          ...record,
          favorite_count: Math.max(0, record.favorite_count + delta),
        }
      : record;

  return Object.fromEntries(
    Object.entries(patched).map(([key, child]) => [
      key,
      patchFavoriteCount(child, propertyId, delta),
    ]),
  );
};

export const useTogglePropertyLike = (propertyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => PropertyService.LikeProperty({ property_id: propertyId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: propertyKeys.all });
      const wasLiked = useStoreParams.getState().likes.includes(propertyId);
      const snapshots = queryClient.getQueriesData({
        queryKey: propertyKeys.all,
      });
      const delta = wasLiked ? -1 : 1;

      queryClient.setQueriesData({ queryKey: propertyKeys.all }, (data) =>
        patchFavoriteCount(data, propertyId, delta),
      );
      useStoreParams.setState((state) => ({
        likes: wasLiked
          ? state.likes.filter((id) => id !== propertyId)
          : [...state.likes, propertyId],
      }));

      return { snapshots, wasLiked };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(([key, data]) =>
        queryClient.setQueryData(key, data),
      );
      if (context) {
        useStoreParams.setState((state) => ({
          likes: context.wasLiked
            ? [...new Set([...state.likes, propertyId])]
            : state.likes.filter((id) => id !== propertyId),
        }));
      }
    },
    onSuccess: (response) => {
      if (response) useStoreParams.setState({ likes: response.favorites });
    },
  });
};
