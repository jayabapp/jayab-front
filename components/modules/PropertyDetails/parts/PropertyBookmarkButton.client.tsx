"use client";

import { useAuthStore, useStoreParams } from "@/store";
import { useTogglePropertyBookmark } from "@features/properties/hooks/useTogglePropertyBookmark";
import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { PropertyBookmarkButtonProps } from "@/types/components/modules/property-details";

const PropertyBookmarkButton = ({
  className,
  propertyId,
}: PropertyBookmarkButtonProps) => {
  const t = useTranslations("listing");

  const { bookmarks } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const { mutate, isPending } = useTogglePropertyBookmark(propertyId);
  const isBookmarked = bookmarks?.includes(propertyId);

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={isBookmarked}
      aria-label={t("bookmarks")}
      className={className}
      onClick={() => {
        if (isLogin) mutate();
        else useStoreParams.setState({ loginModal: true });
      }}
    >
      <Icon
        name="bookmark"
        className={isBookmarked ? "fill-current text-link" : ""}
      />
    </button>
  );
};

export default PropertyBookmarkButton;
