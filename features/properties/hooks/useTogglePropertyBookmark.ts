"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PropertyService } from "@/api_services/property/property.service";
import { useStoreParams } from "@/store";
import { userKeys } from "@features/user/api/user.keys";

export const useTogglePropertyBookmark = (propertyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      PropertyService.BookmarkProperty({ property_id: propertyId }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: userKeys.bookmarks() });
      const wasBookmarked = useStoreParams
        .getState()
        .bookmarks.includes(propertyId);
      const previousBookmarks = queryClient.getQueryData(
        userKeys.bookmarks(),
      );
      useStoreParams.setState((state) => ({
        bookmarks: wasBookmarked
          ? state.bookmarks.filter((id) => id !== propertyId)
          : [...state.bookmarks, propertyId],
      }));
      return { previousBookmarks, wasBookmarked };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(
        userKeys.bookmarks(),
        context.previousBookmarks,
      );
      useStoreParams.setState((state) => ({
        bookmarks: context.wasBookmarked
          ? [...new Set([...state.bookmarks, propertyId])]
          : state.bookmarks.filter((id) => id !== propertyId),
      }));
    },
    onSuccess: (response) => {
      if (response) useStoreParams.setState({ bookmarks: response.bookmarks });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: userKeys.bookmarks() }),
  });
};
