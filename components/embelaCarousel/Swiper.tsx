"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { EmblaOptionsType, EmblaPluginType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import { useMediaQuery } from "react-responsive";
import { useAutoplay } from "./EmblaCarouselAutoplay";
import Autoplay from "embla-carousel-autoplay";
type PropType = {
  options?: EmblaOptionsType;
  children: ReactNode;
  slidesWidth?: { def: string; md: string };
  dir?: "rtl" | "ltr";
  spacing?: string;
  autoplay?: boolean;
  pagination?: boolean;
};

const Swiper: React.FC<PropType> = (props) => {
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
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [...extraOptions]);

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

  const { autoplayIsPlaying, toggleAutoplay, onAutoplayButtonClick } = useAutoplay(emblaApi);

  /* -------------------------------------------------------------------------- */
  /*                                 PAGINATION                                 */
  /* -------------------------------------------------------------------------- */

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);

  return (
    <section
      style={{
        ...sizeStyle,
      }}
      className="embla relative"
      dir={dir}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">{children}</div>
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
      ) : (
        <></>
      )}
    </section>
  );
};

export default Swiper;
