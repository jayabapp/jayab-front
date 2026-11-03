"use client";

import type { CarouselPaginationState } from "@/types/components/elements/carousel";
import type { CarouselButtonProps } from "@/types/components/elements/carousel";
import { useCallback, useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): CarouselPaginationState => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const animationFrame = requestAnimationFrame(() => {
      onInit(emblaApi);
      onSelect(emblaApi);
    });
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);

    return () => {
      cancelAnimationFrame(animationFrame);
      emblaApi
        .off("reInit", onInit)
        .off("reInit", onSelect)
        .off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  };
};

export const DotButton: React.FC<CarouselButtonProps> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button name={"dot_butt"} type="button" {...restProps}>
      {children}
    </button>
  );
};
