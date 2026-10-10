"use client";

import { useEffect, useId, useMemo } from "react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton.client";
import { NextButton, PrevButton } from "./EmblaCarouselArrowButtons.client";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons.client";
import { ContentImage } from "@elements/Image";
import { arrowSides } from "./EmblaCarouselArrowButtons.client";
import { useDir } from "@hooks/useDir";

import type { EmblaPluginType } from "embla-carousel";
import type { CarouselProps } from "@/types/components/elements/carousel";
import type { FC } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const Swiper: FC<CarouselProps> = (props) => {
  const {
    autoFit,
    children,
    pagination,
    withArrows,
    parentClass,
    dir: dirProp,
    selectedIndexCb,
    autoplay = false,
    onShowCountClick,
    viewportClassName,
    options = { align: "start", dragFree: true },
  } = props;

  const extraOptions = useMemo<EmblaPluginType[]>(
    () => (autoplay ? [Autoplay({ playOnInit: true, delay: 3000 })] : []),
    [autoplay],
  );

  const localeDir = useDir();
  const dir = dirProp ?? localeDir;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { ...options, direction: dir },
    extraOptions,
  );

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
  const nav = usePrevNextButtons(emblaApi);
  const { showLeft, showRight, onLeft, onRight } = arrowSides(nav, dir);

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
            {showLeft ? (
              <PrevButton
                className=" !-top-[10%] !left-0 scale-75 hover:scale-[0.8]  md:hover:scale-102   md:scale-100"
                onClick={onLeft}
              />
            ) : (
              <></>
            )}

            {showRight ? (
              <NextButton
                onClick={onRight}
                className="!right-0 !-top-[10%] scale-75  hover:scale-[0.8]  md:hover:scale-102  md:scale-100"
              />
            ) : (
              <></>
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
          className="absolute cursor-pointer bottom-4 flex items-center justify-evenly end-4 rounded-md start-auto w-11 h-7 bg-surface/70"
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
