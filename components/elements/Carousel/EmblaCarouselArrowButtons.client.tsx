"use client";

import { useCallback, useEffect, useState } from "react";
import { Icon } from "@elements/Icon";

import type { CarouselNavigationState } from "@/types/components/elements/carousel";
import type { CarouselButtonProps } from "@/types/components/elements/carousel";
import type { EmblaCarouselType } from "embla-carousel";

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

export const arrowSides = (
  nav: CarouselNavigationState,
  dir: "rtl" | "ltr",
) => {
  const rtl = dir === "rtl";
  return {
    showLeft: rtl ? !nav.nextBtnDisabled : !nav.prevBtnDisabled,
    showRight: rtl ? !nav.prevBtnDisabled : !nav.nextBtnDisabled,
    onLeft: rtl ? nav.onNextButtonClick : nav.onPrevButtonClick,
    onRight: rtl ? nav.onPrevButtonClick : nav.onNextButtonClick,
  };
};

type TEdgeArrow = {
  label: string;
  onClick: () => void;
  side: "left" | "right";
};

export const EdgeArrowButton = ({ side, label, onClick }: TEdgeArrow) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink shadow-card transition-colors hover:bg-surface-muted md:flex ${
      side === "left" ? "left-1" : "right-1"
    }`}
  >
    <Icon
      name="chevron-left"
      size={20}
      className={side === "right" ? "rotate-180" : ""}
    />
  </button>
);

export const PrevButton: React.FC<CarouselButtonProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={` my-auto    flex bottom-0 top-5  items-center justify-center hover:scale-102 group hover:bg-action  transition-all lg:flex md:flex-col absolute z-10 bg-surface/40   rounded-full cursor-pointer h-10 w-10 left-4   right-auto ${className}`}
      type="button"
      {...restProps}
    >
      <Icon
        name="chevron-left"
        size={20}
        className="select-none text-ink group-hover:text-on-action"
      />
    </button>
  );
};

export const NextButton: React.FC<CarouselButtonProps> = (props) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={` my-auto    flex bottom-0 top-5   items-center justify-center hover:scale-102 group hover:bg-action  transition-all lg:flex md:flex-col absolute z-10 bg-surface/40   rounded-full cursor-pointer h-10 w-10 right-4   left-auto ${className}`}
      type="button"
      {...restProps}
    >
      <Icon
        name="chevron-left"
        size={20}
        className="rotate-180 select-none text-ink group-hover:text-on-action"
      />
    </button>
  );
};
