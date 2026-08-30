"use client";

import { useTogglePropertyBookmark } from "@features/properties/hooks/useTogglePropertyBookmark";
import type { PropertyBookmarkButtonProps } from "@/types/components/modules/property-details";
import { useAuthStore, useStoreParams } from "@/store";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

const PropertyBookmarkButton = ({
  propertyId,
}: PropertyBookmarkButtonProps) => {
  const { bookmarks } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const { mutate, isPending } = useTogglePropertyBookmark(propertyId);
  const isBookmarked = bookmarks?.includes(propertyId);

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={isBookmarked}
      aria-label={_STRINGS.BOOKMARKS}
      className="w-5 cursor-pointer h-5 aspect-square"
      onClick={() => {
        if (isLogin) mutate();
        else useStoreParams.setState({ loginModal: true });
      }}
    >
      <ContentImage
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 aspect-square"
        src={
          isBookmarked
            ? "/assets/icons/adds/filled_bookmark.svg"
            : "/assets/icons/adds/empty_bookmark.svg"
        }
      />
    </button>
  );
};

export default PropertyBookmarkButton;
