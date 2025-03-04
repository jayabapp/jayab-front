import React, { ComponentPropsWithRef, useCallback, useEffect, useState } from "react";
import { EmblaCarouselType } from "embla-carousel";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined): UsePrevNextButtonsType => {
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

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton: React.FC<PropType> = (props) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={` my-auto    flex bottom-0 top-5  items-center justify-center hover:scale-102 group hover:bg-primary-700 dark:hover:bg-primary-700 transition-all lg:flex md:flex-col absolute z-10 bg-white/40 dark:bg-zinc-800  rounded-full cursor-pointer h-10 w-10 left-4   right-auto  bg-gray-250 ${className}`}
      type="button"
      {...restProps}
    >
      <img
        src="/assets/icons/shared/chevron.svg"
        className="w-6 h-6  rotate-90 dark:opacity-50 dark:invert select-none group-hover:invert"
        alt="chvronSwiper"
      />
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { className, ...restProps } = props;

  return (
    <button
      className={` my-auto    flex bottom-0 top-5   items-center justify-center hover:scale-102 group hover:bg-primary-700 dark:hover:bg-primary-700 transition-all lg:flex md:flex-col absolute z-10 bg-white/40 dark:bg-zinc-800  rounded-full cursor-pointer h-10 w-10 right-4   left-auto  bg-gray-250  ${className}`}
      type="button"
      {...restProps}
    >
      <img
        src="/assets/icons/shared/chevron.svg"
        className="w-6 h-6  -rotate-90 dark:opacity-50 dark:invert select-none group-hover:invert"
        alt="chvronSwiper"
      />
    </button>
  );
};
