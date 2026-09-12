"use client";

import type {
  HeroSlide,
  HeroSlideImageProps,
  HomeHeroBannerProps,
} from "@/types/components/modules/home";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import type { HomeBannerDto } from "@/types/components/templates/home";
import type { CSSProperties, FocusEvent, PointerEvent } from "react";
import { HomeHeroSearch } from "@modules/HomeHeroSearch";
import { STATIC_HERO_SLIDES } from "./heroSlides";
import { ContentImage } from "@elements/Image";
import { getImageProps } from "next/image";

import _STRINGS from "@/utils/LocalStrings";
import Editable from "@elements/Editable";

const SWIPE_THRESHOLD_PX = 40;
const MOBILE_ART_QUERY = "(max-width: 1023px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const AUTOPLAY_MS = 6500;
const COVERED_AT = 0.55;

const subscribeReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const readReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

const onIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(id);
};

const withIndex = (set: ReadonlySet<number>, index: number) =>
  set.has(index) ? set : new Set(set).add(index);

const cmsSlide = (banner: HomeBannerDto): HeroSlide => {
  const desktopSrc = getHomeImageUrl(banner?.image);
  return {
    key: `cms-${banner?.id}`,
    alt: banner?.image?.alt || banner?.title || "",
    desktopSrc,
    mobileSrc: banner?.image_sm ? getHomeImageUrl(banner.image_sm) : desktopSrc,
    contentId: banner?.id,
    imageClasses: banner?.imageClasses,
  };
};

const HeroSlideImage = ({ slide, isFirst, onLoad }: HeroSlideImageProps) => {
  const shared = {
    alt: slide.alt,
    fill: true,
    sizes: "100vw",
    loading: "eager" as const,
    fetchPriority: isFirst ? ("high" as const) : ("low" as const),
    unoptimized: slide.desktopSrc.endsWith(".svg"),
  };
  const { props: desktopImage } = getImageProps({
    ...shared,
    src: slide.desktopSrc,
  });
  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({ ...shared, src: slide.mobileSrc });
  const photoStyle = {
    ...desktopImage.style,
    "--hero-focus": slide.focus ?? "50% 50%",
  } as CSSProperties;

  return (
    <picture>
      <source sizes="100vw" srcSet={mobileSrcSet} media={MOBILE_ART_QUERY} />
      <img
        {...desktopImage}
        alt={slide.alt}
        style={photoStyle}
        onLoad={onLoad}
        ref={(element) => {
          if (element?.complete && element.naturalWidth) onLoad();
        }}
        className={`hero-slide-photo object-cover [object-position:var(--hero-focus)] ${slide.imageClasses ?? ""}`}
      />
    </picture>
  );
};

const HomeBannerPart = ({ title, devices, banners }: HomeHeroBannerProps) => {
  const isPhone = !!devices?.isMobile;

  const slides = useMemo(
    () => [
      ...(banners ?? []).filter((banner) => banner?.image).map(cmsSlide),
      ...STATIC_HERO_SLIDES,
    ],
    [banners],
  );
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState<ReadonlySet<number>>(
    () => new Set([0]),
  );
  const [loaded, setLoaded] = useState<ReadonlySet<number>>(() => new Set());
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    () => false,
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const advanceWhenLoaded = useRef(false);

  const nextIndex = count ? (index + 1) % count : 0;
  const firstReady = loaded.has(0);
  const playing =
    count > 1 && !hovered && !focused && onScreen && !reducedMotion;

  const goTo = (target: number) => {
    advanceWhenLoaded.current = false;
    setMounted((current) => withIndex(current, target));
    setIndex(target);
  };

  const markLoaded = (slideIndex: number) => {
    setLoaded((current) => withIndex(current, slideIndex));
    if (advanceWhenLoaded.current && slideIndex === nextIndex) goTo(slideIndex);
  };

  const onProgressEnd = () => {
    if (loaded.has(nextIndex)) goTo(nextIndex);
    else advanceWhenLoaded.current = true;
  };

  useEffect(() => {
    if (!firstReady || count < 2) return;
    return onIdle(() => setMounted((current) => withIndex(current, nextIndex)));
  }, [firstReady, nextIndex, count]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const visible =
        document.visibilityState === "visible" &&
        window.scrollY < root.offsetHeight * COVERED_AT;
      setOnScreen((current) => (current === visible ? current : visible));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start || count < 2) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX || Math.abs(dx) < Math.abs(dy))
      return;
    goTo(dx > 0 ? nextIndex : (index - 1 + count) % count);
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null))
      setFocused(false);
  };

  const editable = slides.find((slide) => slide.contentId !== undefined);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={_STRINGS.HERO_SLIDER}
      data-paused={!playing}
      style={{ "--hero-interval": `${AUTOPLAY_MS}ms` } as CSSProperties}
      className="hero-slider relative w-full h-full px-0"
      onPointerEnter={(event) =>
        event.pointerType === "mouse" && setHovered(true)
      }
      onPointerLeave={(event) =>
        event.pointerType === "mouse" && setHovered(false)
      }
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
    >
      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end gap-4 px-4 md:gap-6 ${
          // On phones the search pill rides the sheet's lip instead, so the
          // caption only needs clearance for that lip — see HomeTemplate.
          isPhone ? "pb-14" : "pb-12 md:pb-14"
        }`}
      >
        <div className="home-hero-content flex max-w-2xl flex-col items-center gap-2 text-center md:gap-3">
          <ContentImage
            width={320}
            height={166}
            alt={_STRINGS.HOME_TITLE}
            sizes="(max-width: 1024px) 96px, 160px"
            className="h-auto !w-24 drop-shadow-md lg:!w-40"
            src="/assets/images/home/home_banner_logo.webp"
          />
          <h2 className="text-balance text-sm font-bold leading-snug text-white drop-shadow-md md:text-xl">
            {title || _STRINGS.HOME_TITLE}
          </h2>
        </div>

        {isPhone ? (
          <></>
        ) : (
          <div className="w-full max-w-3xl">
            <HomeHeroSearch isPhone={false} />
          </div>
        )}
      </div>
      <div className="hero-backdrop pointer-events-none absolute inset-0 z-5 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {count > 1 ? (
        <span
          key={index}
          aria-hidden="true"
          onAnimationEnd={onProgressEnd}
          className="hero-clock pointer-events-none absolute size-px opacity-0"
        />
      ) : (
        <></>
      )}

      <Editable
        isBanner
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        contentId={editable?.contentId}
        editIconClass="!top-auto !bottom-0"
        onPointerCancel={() => (swipeStart.current = null)}
        className="hero-backdrop relative aspect-[3/2] w-full touch-pan-y overflow-hidden px-0 focus:outline-none sm:aspect-[2/1] lg:aspect-[3.029] lg:min-h-[23rem]"
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.key}
            data-active={slideIndex === index}
            aria-hidden={slideIndex !== index}
            className="hero-slide absolute inset-0"
          >
            {mounted.has(slideIndex) ? (
              <HeroSlideImage
                slide={slide}
                isFirst={slideIndex === 0}
                onLoad={() => markLoaded(slideIndex)}
              />
            ) : (
              <></>
            )}
          </div>
        ))}
      </Editable>
    </div>
  );
};

export default HomeBannerPart;
