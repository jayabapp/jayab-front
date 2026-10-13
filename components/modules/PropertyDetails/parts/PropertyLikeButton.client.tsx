"use client";

import { useAuthStore, useStoreParams } from "@/store";
import { useTogglePropertyLike } from "@features/properties/hooks/useTogglePropertyLike";
import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { PropertyLikeButtonProps } from "@/types/components/modules/property-details";

const PropertyLikeButton = ({
  children,
  className,
  propertyId,
  onCountChange,
}: PropertyLikeButtonProps) => {
  const t = useTranslations("listing");

  const { likes } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const { mutate, isPending } = useTogglePropertyLike(propertyId);
  const isLiked = likes.includes(propertyId);

  const onToggle = () => {
    if (!isLogin) {
      useStoreParams.setState({ loginModal: true });
      return;
    }
    if (isPending) return;
    const delta = isLiked ? -1 : 1;
    onCountChange(delta);
    mutate(undefined, { onError: () => onCountChange(-delta) });
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-pressed={isLiked}
      aria-label={t("likes")}
    >
      <Icon
        name="heart"
        className={isLiked ? "fill-current text-status-danger" : ""}
      />
      {children}
    </button>
  );
};

export default PropertyLikeButton;
