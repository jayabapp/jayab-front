"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { NextButton, PrevButton } from "./EmblaCarouselArrowButtons";
import { usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import { EmblaOptionsType } from "embla-carousel";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMediaQuery } from "react-responsive";
import { ContentImage } from "@/components/elements/Image";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type PropType = {
  slides: any[];
  spacing?: string;
  autoplay?: boolean;
  dir?: "rtl" | "ltr";
  children: ReactNode;
  pagination?: boolean;
  options?: EmblaOptionsType;
  LoadingSkeleton?: ReactNode;
  defaultSelectedIndex?: number;
  slidesWidth?: { def: string; md: string };
};

const SwiperWithThumnails: React.FC<PropType> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });
  const {
    options = { align: "start", direction: "rtl" },
    children,
    dir = "rtl",
    slidesWidth,
    spacing,
    autoplay = false,
    slides,
    defaultSelectedIndex,
    LoadingSkeleton,
  } = props;

  const extraOptions = useMemo(
    () => (autoplay ? [Autoplay({ playOnInit: true, delay: 3000 })] : []),
    [autoplay],
  );

  const [emblaRef, emblaMainApi] = useEmblaCarousel(options, [...extraOptions]);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: false,
    align: "center",
    direction: "rtl",
  });

  const slideWidth = isDesktopOrLaptop
    ? slidesWidth?.md || "24%"
    : slidesWidth?.def || "35%";

  const sizeStyle: any = {
    "--slide-spacing": spacing || "1rem",
    "--slide-size": slideWidth,
  };

  useEffect(() => {
    if (!emblaMainApi || !emblaThumbsApi || !defaultSelectedIndex) return;
    emblaMainApi.scrollTo(defaultSelectedIndex);
  }, [defaultSelectedIndex, emblaThumbsApi, emblaMainApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
    const frame = requestAnimationFrame(onSelect);
    return () => {
      cancelAnimationFrame(frame);
      emblaMainApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaMainApi, onSelect]);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaMainApi);
  return (
    <section
      style={{
        ...sizeStyle,
      }}
      className="embla relative"
      dir={dir}
    >
      <div className="embla__viewport relative flex" ref={emblaRef}>
        <div className="embla__container">
          {emblaMainApi ? (
            children
          ) : !!LoadingSkeleton ? (
            LoadingSkeleton
          ) : (
            <></>
          )}
        </div>
        <div className="  embla__buttons">
          {!!nextBtnDisabled ? (
            <></>
          ) : (
            <PrevButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
            />
          )}
          {!!prevBtnDisabled ? (
            <> </>
          ) : (
            <NextButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
            />
          )}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((i, index) => (
              <div key={i?.id || index} className="w-full embla-thumbs__slide ">
                <div
                  onClick={() => onThumbClick(index)}
                  className={`       w-full h-full  overflow-clip rounded-10 border cursor-pointer transition-all ease-in-out duration-300   ${
                    index === selectedIndex
                      ? "border-primary-700  dark:border-zinc-200 "
                      : "border-gray-300 opacity-60 dark:border-zinc-600"
                  } `}
                >
                  <ContentImage
                    src={NEW_IMAGE_URL(i, "thumbnail")}
                    width={256}
                    height={256}
                    sizes="(min-width: 768px) 12vw, 25vw"
                    alt={i?.alt || ""}
                    className={`  ${
                      i?.type != 1 ? " blur-sm" : ""
                    }  aspect-square  object-cover p-1 w-full rounded-10 h-full  `}
                  />{" "}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SwiperWithThumnails;
