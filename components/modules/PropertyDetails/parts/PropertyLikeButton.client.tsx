"use client";

import type { PropertyLikeButtonProps } from "@/types/components/modules/property-details";
import { useTogglePropertyLike } from "@features/properties/hooks/useTogglePropertyLike";
import { useAuthStore, useStoreParams } from "@/store";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

const PropertyLikeButton = ({
  onCountChange,
  propertyId,
}: PropertyLikeButtonProps) => {
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
      aria-pressed={isLiked}
      aria-label={_STRINGS.LIKES}
      className="w-5 cursor-pointer h-5 aspect-square"
    >
      <ContentImage
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 aspect-square"
        src={
          isLiked
            ? "/assets/icons/adds/filled_heart.svg"
            : "/assets/icons/adds/empty_heart.svg"
        }
      />
    </button>
  );
};

export default PropertyLikeButton;
