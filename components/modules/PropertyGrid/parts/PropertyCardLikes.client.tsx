"use client";

import { useTranslations } from "next-intl";
import { useStoreParams } from "@/store";
import { ContentImage } from "@elements/Image";

import type { PropertyCardLikesProps } from "@/types/components/modules/property-grid";

const PropertyCardLikes = ({
  propertyId,
  favoriteCount,
  forceFilled = false,
}: PropertyCardLikesProps) => {
  const t = useTranslations("listing");
  const { likes, ssrLikedProducts } = useStoreParams((state) => state);
  const isLiked = likes?.includes(propertyId);
  const likesCount = ssrLikedProducts?.[propertyId] ?? favoriteCount ?? 0;
  const heartSrc =
    forceFilled || isLiked
      ? "/assets/icons/adds/filled_heart.svg"
      : "/assets/icons/adds/empty_heart.svg";

  return (
    <div className="flex shrink-0 items-center gap-1 text-sm">
      <ContentImage
        width={16}
        height={16}
        src={heartSrc}
        alt={t("likes")}
        className="h-4 w-4 shrink-0"
      />

      <p className="leading-none text-ink-muted">{likesCount}</p>
    </div>
  );
};

export default PropertyCardLikes;
