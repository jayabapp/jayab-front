"use client";

import { NextButton, PrevButton } from "./EmblaCarouselArrowButtons.client";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton.client";
import type { CarouselProps } from "@/types/components/elements/carousel";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons.client";
import type { EmblaPluginType } from "embla-carousel";
import { useEffect, useId, useMemo } from "react";
import { ContentImage } from "@elements/Image";
import type { FC } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Swiper: FC<CarouselProps> = (props) => {
  const {
    options = { align: "start", direction: "rtl", dragFree: true },
    children,
    dir = "rtl",
    autoplay = false,
    pagination,
    withArrows,
    selectedIndexCb,
    viewportClassName,
    parentClass,
    autoFit,
    onShowCountClick,
  } = props;

  const extraOptions = useMemo<EmblaPluginType[]>(
    () => (autoplay ? [Autoplay({ playOnInit: true, delay: 3000 })] : []),
    [autoplay],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(options, extraOptions);

  const instanceId = useId().replace(/[^a-zA-Z0-9]/g, "");

  const slideVarsCss = (() => {
    const sel = `[data-embla-id="${instanceId}"]`;
    const breakpoints = props.breakPoints
      ? Object.entries(props.breakPoints)
      : [];

    if (autoFit)
      return `${sel}{--slide-spacing:${props?.spaceBetween ?? "0.5rem"};--slide-size:auto}`;
    let css =
      `${sel}{--slide-spacing:${props?.spaceBetween ?? "0rem"};` +
      `--slide-size:${100 / (props?.slidesPerView || 1)}%}`;

    for (const [size, bp] of breakpoints) {
      const spacing = bp?.spaceBetween
        ? `${bp.spaceBetween}px`
        : (props?.spaceBetween ?? "0rem");
      const slideSize = `${100 / (bp?.slidesPerView || props?.slidesPerView || 1)}%`;
      css += `@media(min-width:${Number(size)}px){${sel}{--slide-spacing:${spacing};--slide-size:${slideSize}}}`;
    }
    return css;
  })();

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  useEffect(() => {
    if (!!selectedIndexCb) {
      selectedIndexCb(selectedIndex);
    }
  }, [selectedIndexCb, selectedIndex]);

  return (
    <section
      data-embla-id={instanceId}
      className={`embla relative ${parentClass}`}
      dir={dir}
    >
      <style>{slideVarsCss}</style>
      <div className={`embla__viewport ${viewportClassName}`} ref={emblaRef}>
        <div className="embla__container">{children}</div>

        {!!withArrows && (
          <div className="  embla__buttons ">
            {!!nextBtnDisabled ? (
              <></>
            ) : (
              <PrevButton
                className=" !-top-[10%] !left-0 scale-75 hover:scale-[0.8]  md:hover:scale-102   md:scale-100"
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            )}

            {!!prevBtnDisabled ? (
              <></>
            ) : (
              <NextButton
                className="!right-0 !-top-[10%] scale-75  hover:scale-[0.8]  md:hover:scale-102  md:scale-100"
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
            )}
          </div>
        )}
      </div>

      {pagination ? (
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : "",
              )}
            />
          ))}
        </div>
      ) : !!onShowCountClick && !!emblaApi ? (
        <div
          onClick={() => {
            onShowCountClick(selectedIndex);
          }}
          className="absolute cursor-pointer bottom-4 flex items-center justify-evenly left-4 rounded-md right-auto w-11 h-7 bg-white/70"
        >
          <p className="text-sm h-full text-center flex items-center justify-center mt-0.5">
            {scrollSnaps?.length}
          </p>
          <ContentImage
            alt=""
            width={14}
            height={14}
            className="w-3.5"
            src="/assets/icons/property/upscale_icon.svg"
          />
        </div>
      ) : null}
    </section>
  );
};

export default Swiper;
