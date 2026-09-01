"use client";

import type { CarouselNavigationState } from "@/types/components/elements/carousel";
import type { CarouselButtonProps } from "@/types/components/elements/carousel";
import { useCallback, useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";
import { ContentImage } from "@elements/Image";

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): CarouselNavigationState => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const animationFrame = requestAnimationFrame(() => onSelect(emblaApi));
    emblaApi.on("reInit", onSelect).on("select", onSelect);

    return () => {
      cancelAnimationFrame(animationFrame);
      emblaApi.off("reInit", onSelect).off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

export const PrevButton: React.FC<CarouselButtonProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={` my-auto    flex bottom-0 top-5  items-center justify-center hover:scale-102 group hover:bg-brand-600  transition-all lg:flex md:flex-col absolute z-10 bg-white/40   rounded-full cursor-pointer h-10 w-10 left-4   right-auto ${className}`}
      type="button"
      {...restProps}
    >
      <ContentImage
        width={24}
        height={24}
        alt="chvronSwiper"
        src="/assets/icons/shared/chevron.svg"
        className="w-6 h-6  rotate-90   select-none group-hover:invert"
      />
    </button>
  );
};

export const NextButton: React.FC<CarouselButtonProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={` my-auto    flex bottom-0 top-5   items-center justify-center hover:scale-102 group hover:bg-brand-600  transition-all lg:flex md:flex-col absolute z-10 bg-white/40   rounded-full cursor-pointer h-10 w-10 right-4   left-auto ${className}`}
      type="button"
      {...restProps}
    >
      <ContentImage
        width={24}
        height={24}
        alt="chvronSwiper"
        src="/assets/icons/shared/chevron.svg"
        className="w-6 h-6  -rotate-90   select-none group-hover:invert"
      />
    </button>
  );
};
