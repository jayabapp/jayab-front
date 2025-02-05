"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
const MediaQuery = dynamic(() => import("react-responsive"), {
  ssr: false,
});

type PropType = {
  options?: EmblaOptionsType;
  children: ReactNode;
  slidesWidth?: { def: string; md: string };
  dir?: "rtl" | "ltr";
  spacing?: string;
};

const Swiper: React.FC<PropType> = (props) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 768px)",
  });
  const [slideWidth, setSlideWidth] = useState("20%");

  const { options = { align: "start", direction: "rtl" }, children, dir = "rtl", slidesWidth, spacing } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const router = useRouter();

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

  return (
    <section
      style={{
        ...sizeStyle,
      }}
      className="embla"
      dir={dir}
    >
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">{children}</div>
      </div>
    </section>
  );
};

export default Swiper;
