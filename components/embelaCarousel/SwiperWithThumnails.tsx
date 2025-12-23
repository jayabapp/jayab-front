"use client";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { NextButton, PrevButton, usePrevNextButtons } from "./EmblaCarouselArrowButtons";
import { useAutoplay } from "./EmblaCarouselAutoplay";
type PropType = {
  options?: EmblaOptionsType;
  children: ReactNode;
  slidesWidth?: { def: string; md: string };
  dir?: "rtl" | "ltr";
  spacing?: string;
  autoplay?: boolean;
  pagination?: boolean;
  slides: any[];
  defaultSelectedIndex?: number;
  LoadingSkeleton?: ReactNode;
};

const SwiperWithThumnails: React.FC<PropType> = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });
  const [slideWidth, setSlideWidth] = useState("20%");
  const {
    options = { align: "start", direction: "rtl" },
    children,
    dir = "rtl",
    slidesWidth,
    spacing,
    autoplay = false,
    pagination,
    slides,
    defaultSelectedIndex,
    LoadingSkeleton,
  } = props;

  /* -------------------------------------------------------------------------- */
  /*                           SETTING EXTRA OPTIONS                          */
  /* -------------------------------------------------------------------------- */
  const [extraOptions, setExtraOptions] = useState<EmblaPluginType[]>([]);
  useEffect(() => {
    const extraoptionsVar = [];
    if (autoplay) {
      extraoptionsVar.push(Autoplay({ playOnInit: true, delay: 3000 }));
    }
    setExtraOptions(extraoptionsVar);
  }, [autoplay]);

  /* -------------------------------------------------------------------------- */
  /*                             CREATING  CAROUSEL                             */
  /* -------------------------------------------------------------------------- */
  const [emblaRef, emblaMainApi] = useEmblaCarousel(options, [...extraOptions]);
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: false,
    align: "center",
    direction: "rtl",
  });

  useEffect(() => {
    if (!!isDesktopOrLaptop) {
      setSlideWidth(slidesWidth?.md || "24%");
    } else {
      setSlideWidth(slidesWidth?.def || "35%");
    }
  }, [isDesktopOrLaptop]);

  const sizeStyle: any = {
    "--slide-spacing": spacing || "1rem",
    "--slide-size": slideWidth,
  };

  /* -------------------------------------------------------------------------- */
  /*                              AUTOPLAY OPTIONS                              */
  /* -------------------------------------------------------------------------- */

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } = useAutoplay(emblaMainApi);
  /* -------------------------------------------------------------------------- */
  /*                            DEFAULT INDEX SELECT                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!emblaMainApi || !emblaThumbsApi || !defaultSelectedIndex) return;
    emblaMainApi.scrollTo(defaultSelectedIndex);
  }, [defaultSelectedIndex, emblaThumbsApi, emblaMainApi]);

  /* -------------------------------------------------------------------------- */
  /*                                 PAGINATION                                 */
  /* -------------------------------------------------------------------------- */

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return;
      emblaMainApi.scrollTo(index);
    },
    [emblaMainApi, emblaThumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaMainApi) return;
    onSelect();

    emblaMainApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaMainApi, onSelect]);

  /* -------------------------------------------------------------------------- */
  /*                                   ARROWS                                   */
  /* -------------------------------------------------------------------------- */

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaMainApi);
  return (
    <section
      style={{
        ...sizeStyle,
      }}
      className="embla relative"
      dir={dir}
    >
      <div className="embla__viewport relative flex" ref={emblaRef}>
        <div className="embla__container">{emblaMainApi ? children : !!LoadingSkeleton ? LoadingSkeleton : <></>}</div>
        <div className="  embla__buttons">
          {!!nextBtnDisabled ? <></> : <PrevButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />}
          {!!prevBtnDisabled ? <> </> : <NextButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />}
        </div>
      </div>

      <div className="embla-thumbs">
        <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
          <div className="embla-thumbs__container">
            {slides.map((i, index) => (
              <div className="w-full embla-thumbs__slide ">
                <div
                  onClick={() => onThumbClick(index)}
                  className={`       w-full h-full  overflow-clip rounded-10 border cursor-pointer transition-all ease-in-out duration-300   ${
                    index === selectedIndex
                      ? "border-primary-700  dark:border-zinc-200 "
                      : "border-gray-300 opacity-60 dark:border-zinc-600"
                  } `}
                >
                  <img
                    // src={i?.type == 1 ? NEW_IMAGE_URL(i) : i?.cover}
                    src={NEW_IMAGE_URL(i, "thumbnail")}
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
