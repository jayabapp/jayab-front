"use client";

import { useStoreParams } from "@/store";

const PropertyCardLikes = ({
  propertyId,
  favoriteCount,
}: {
  propertyId: number;
  favoriteCount?: number;
}) => {
  const { likes, ssrLikedProducts } = useStoreParams((state) => state);

  return (
    <div className="flex items-center gap-1">
      <img
        alt={`heart${propertyId}`}
        className="w-4 h-4 aspect-square"
        src={
          likes?.includes(propertyId)
            ? "/assets/icons/adds/filled_heart.svg"
            : "/assets/icons/adds/empty_heart.svg"
        }
      />
      <p className="text-xxs  opacity-60">
        {ssrLikedProducts?.[propertyId] || favoriteCount}
      </p>
    </div>
  );
};

export default PropertyCardLikes;
