"use client";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { ReactNode, useMemo, useState } from "react";
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";

type MediaSizes = 320 | 640 | 768 | 1024 | 1600;

type PropType = {
  options?: EmblaOptionsType;
  slidesPerView?: number;
  viewportClassName?: string;
  spaceBetween?: number | string;
  breakPoints?: Record<MediaSizes, { slidesPerView?: number; spaceBetween?: number | string }>;
  children: ReactNode;
  slidesWidth?: { def: string; md: string; tablet?: string };
  dir?: "rtl" | "ltr";
  parentClass?: string;
  autoplay?: boolean;
  pagination?: boolean;
  withArrows?: boolean;
  autoFit?: boolean;
  withSimpleArrows?: boolean;
  selectedIndexCb?: (i: any) => void | null;
  onShowCountClick?: (e: any) => void | null;
};

const Swiper: React.FC<PropType> = (props) => {
  const BREAKPOINTS = props?.breakPoints ? Object.entries(props?.breakPoints) : undefined;

  const {
    options = { align: "start", direction: "rtl", dragFree: true },
    children,
    dir = "rtl",
    autoplay = false,
    pagination,
    withArrows,
    withSimpleArrows,
    selectedIndexCb,
    viewportClassName,
    parentClass,
    autoFit,
    onShowCountClick,
  } = props;

  const [extraOptions, setExtraOptions] = useState<EmblaPluginType[]>([]);

  React.useEffect(() => {
    const extraoptionsVar = [];
    if (autoplay) {
      extraoptionsVar.push(Autoplay({ playOnInit: true, delay: 3000 }));
    }
    setExtraOptions(extraoptionsVar);
  }, [autoplay]);

  const [emblaRef, emblaApi] = useEmblaCarousel(options, extraOptions);

  // `--slide-size` used to be resolved in JS from `window.innerWidth`, which is
  // only readable after hydration. The server therefore emitted the width implied
  // by the `slidesPerView` prop and the client swapped in the matching
  // breakpoint's width once hydrated. Slides are aspect-ratio constrained, so
  // that width change was also a height change, and every row below the carousel
  // moved — the single 0.233 layout shift on the homepage.
  //
  // The same breakpoint table is emitted as plain CSS media queries instead.
  // CSS is applied at first paint, so the server-rendered layout and the
  // hydrated layout are dimensionally identical and nothing moves. The values
  // below reproduce the previous expressions exactly; only *when* they are
  // resolved has changed. Embla is unaffected — it measures slide widths from
  // the DOM and never received these options.
  const instanceId = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  const slideVarsCss = useMemo(() => {
    const sel = `[data-embla-id="${instanceId}"]`;

    if (autoFit) {
      return `${sel}{--slide-spacing:${props?.spaceBetween ?? "0.5rem"};--slide-size:auto}`;
    }

    // Matches the old `!innerWidth` fallback branch.
    let css =
      `${sel}{--slide-spacing:${props?.spaceBetween ?? "0rem"};` +
      `--slide-size:${100 / (props?.slidesPerView || 1)}%}`;

    // Object.entries orders integer-like keys ascending, so emitting each
    // breakpoint as a min-width query reproduces the old "last matching range
    // wins" lookup through normal cascade order.
    for (const [size, bp] of BREAKPOINTS ?? []) {
      const spacing = bp?.spaceBetween ? `${bp.spaceBetween}px` : (props?.spaceBetween ?? "0rem");
      const slideSize = `${100 / (bp?.slidesPerView || props?.slidesPerView || 1)}%`;
      css += `@media(min-width:${Number(size)}px){${sel}{--slide-spacing:${spacing};--slide-size:${slideSize}}}`;
    }

    return css;
  }, [instanceId, autoFit, props?.spaceBetween, props?.slidesPerView, props?.breakPoints]);

  // const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } = useAutoplay(emblaApi);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  React.useEffect(() => {
    if (!!selectedIndexCb) {
      selectedIndexCb(selectedIndex);
    }
  }, [selectedIndexCb, selectedIndex]);

  // useEffect(() => {
  //   if (!emblaApi) return;
  //   emblaApi?.reInit();
  // }, [children, emblaApi]);
  return (
    <section data-embla-id={instanceId} className={`embla relative ${parentClass}`} dir={dir}>
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
              className={"embla__dot".concat(index === selectedIndex ? " embla__dot--selected" : "")}
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
          <p className="text-sm h-full text-center flex items-center justify-center mt-0.5">{scrollSnaps?.length}</p>
          <img className="w-3.5" src="/assets/icons/property/upscale_icon.svg" />
        </div>
      ) : null}
    </section>
  );
};

export default Swiper;
