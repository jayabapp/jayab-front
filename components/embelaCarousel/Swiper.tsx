"use client";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { ReactNode, useLayoutEffect, useMemo, useState } from "react";
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import { useAutoplay } from "./EmblaCarouselAutoplay";
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
  setSelectedIndex?: (e: any) => void | null;
};

const Swiper: React.FC<PropType> = (props) => {
  const [innerWidth, setInnerWidth] = useState<number | null>(null);
  const isClient = typeof window !== "undefined";

  // FIX: read width before paint & avoid first-render flash
  useLayoutEffect(() => {
    if (!isClient) return;

    const checkSize = () => {
      setInnerWidth(window.innerWidth);
    };

    checkSize(); // before paint
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, [isClient]);

  // Prevent carousel render until width is known

  const BREAKPOINTS = props?.breakPoints ? Object.entries(props?.breakPoints) : undefined;

  const perViewOptions: any = useMemo(() => {
    if (!innerWidth) return { slidesPerView: props?.slidesPerView || 1, spaceBetween: 0 };

    return (
      BREAKPOINTS?.map(([size, options], index) => {
        const WINDOW_WIDTH = innerWidth;
        const IS_LAST = index == BREAKPOINTS?.length - 1;
        const TEMP =
          WINDOW_WIDTH >= Number(size) && (IS_LAST ? true : WINDOW_WIDTH < Number(BREAKPOINTS?.[index + 1]?.[0]));

        if (TEMP) return options;
        return undefined;
      })?.find((i) => !!i) || {
        slidesPerView: props?.slidesPerView || 1,
        spaceBetween: props?.spaceBetween || 0,
      }
    );
  }, [innerWidth]);

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

  const sizeStyle: any = useMemo(
    () =>
      autoFit
        ? {
            "--slide-spacing": "1rem",
            "--slide-size": `auto`,
          }
        : {
            "--slide-spacing": perViewOptions?.spaceBetween
              ? `${perViewOptions?.spaceBetween}px`
              : props?.spaceBetween ?? "0rem",
            "--slide-size": `${100 / (perViewOptions?.slidesPerView || props?.slidesPerView || 1)}%`,
          },
    [perViewOptions, autoFit]
  );

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } = useAutoplay(emblaApi);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi);

  React.useEffect(() => {
    if (!!selectedIndexCb) {
      selectedIndexCb(selectedIndex);
    }
  }, [selectedIndexCb, selectedIndex]);

  return (
    <section style={sizeStyle} className={`embla relative ${parentClass}`} dir={dir}>
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
