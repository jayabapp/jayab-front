"use client";

import { useStoreParams } from "@/store";
import { ContentImage } from "@elements/Image";

import type { PropertyCardLikesProps } from "@/types/components/modules/property-grid";

import _STRINGS from "@/utils/LocalStrings";

const PropertyCardLikes = ({
  propertyId,
  favoriteCount,
  forceFilled = false,
}: PropertyCardLikesProps) => {
  const { likes, ssrLikedProducts } = useStoreParams((state) => state);
  const isLiked = likes?.includes(propertyId);

  return (
    <div className="flex items-center gap-1">
      <ContentImage
        width={16}
        height={16}
        alt={_STRINGS.LIKES}
        className="w-4 h-4 aspect-square"
        src={
          forceFilled || isLiked
            ? "/assets/icons/adds/filled_heart.svg"
            : "/assets/icons/adds/empty_heart.svg"
        }
      />
      <p className="text-xxs opacity-60">
        {ssrLikedProducts?.[propertyId] || favoriteCount}
      </p>
    </div>
  );
};

export default PropertyCardLikes;
