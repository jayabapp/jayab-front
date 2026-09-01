import type { EmblaOptionsType } from "embla-carousel";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { ComponentPropsWithRef, ReactNode } from "react";

export type CarouselMediaSize = 320 | 640 | 768 | 1024 | 1600;

export type CarouselProps = {
  autoFit?: boolean;
  autoplay?: boolean;
  breakPoints?: Record<CarouselMediaSize, { slidesPerView?: number; spaceBetween?: number | string }>;
  children: ReactNode;
  dir?: "rtl" | "ltr";
  onShowCountClick?: (index: number) => void | null;
  options?: EmblaOptionsType;
  pagination?: boolean;
  parentClass?: string;
  selectedIndexCb?: (index: number) => void | null;
  slidesPerView?: number;
  slidesWidth?: { def: string; md: string; tablet?: string };
  spaceBetween?: number | string;
  viewportClassName?: string;
  withArrows?: boolean;
  withSimpleArrows?: boolean;
};

export type CarouselButtonProps = ComponentPropsWithRef<"button">;

export type CarouselNavigationState = {
  nextBtnDisabled: boolean;
  onNextButtonClick: () => void;
  onPrevButtonClick: () => void;
  prevBtnDisabled: boolean;
};

export type CarouselPaginationState = {
  onDotButtonClick: (index: number) => void;
  scrollSnaps: number[];
  selectedIndex: number;
};

export type CarouselAutoplayState = {
  autoplayIsPlaying: boolean;
  onAutoplayButtonClick: (callback: () => void) => void;
  toggleAutoplay: () => void;
};

export type CarouselSlideProps = {
  children?: ReactNode;
  className?: string;
  props?: unknown;
};

export type ThumbnailCarouselProps = {
  LoadingSkeleton?: ReactNode;
  autoplay?: boolean;
  children: ReactNode;
  defaultSelectedIndex?: number;
  dir?: "rtl" | "ltr";
  options?: EmblaOptionsType;
  pagination?: boolean;
  slides: ImageDto[];
  slidesWidth?: { def: string; md: string };
  spacing?: string;
};
