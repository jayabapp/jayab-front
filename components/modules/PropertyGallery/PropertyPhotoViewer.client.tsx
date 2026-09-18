"use client";

import type { PropertyPhotoViewerProps } from "@/types/components/modules/property-gallery";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { PROPERTY_DETAIL_IMAGE_QUALITY } from "@features/properties/constants/image";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import PropertyImageDownloadButton from "./parts/PropertyImageDownloadButton.client";
import _STRINGS from "@/utils/LocalStrings";

const VIEWER_HISTORY_STATE = "jayab-photo-viewer";

const PropertyPhotoViewer = ({
  alt,
  show,
  title,
  images,
  onHide,
  actions,
  hostName,
  startIndex,
  onIndexChange,
}: PropertyPhotoViewerProps) => {
  const [activeIndex, setActiveIndex] = useState(startIndex ?? 0);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageRef = useRef<HTMLDivElement>(null);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      slideRefs.current[index]?.scrollIntoView({
        behavior,
        block: "nearest",
        inline: "center",
      });
    },
    [],
  );

  useEffect(() => {
    if (!show) return;
    const frame = requestAnimationFrame(() => goTo(startIndex ?? 0, "auto"));
    return () => cancelAnimationFrame(frame);
  }, [goTo, show, startIndex]);

  useEffect(() => {
    if (!show) return;
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isFinite(index)) setActiveIndex(index);
      },
      { root: stage, threshold: 0.6 },
    );

    slideRefs.current.forEach((slide) => slide && observer.observe(slide));
    return () => observer.disconnect();
  }, [images.length, show]);

  useEffect(() => {
    if (show) onIndexChange?.(activeIndex);
  }, [activeIndex, onIndexChange, show]);

  useEffect(() => {
    thumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  useEffect(() => {
    if (!show || typeof window === "undefined") return;
    window.history.pushState({ [VIEWER_HISTORY_STATE]: true }, "");
    const onPopState = () => onHide();
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      if (window.history.state?.[VIEWER_HISTORY_STATE]) window.history.back();
    };
  }, [onHide, show]);

  if (!show || !images?.length) return <></>;

  const lastIndex = images.length - 1;
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") goTo(Math.min(activeIndex + 1, lastIndex));
    if (event.key === "ArrowRight") goTo(Math.max(activeIndex - 1, 0));
  };

  return (
    <Dialog open={show} onClose={onHide} className="fixed inset-0 z-[1000]">
      <div aria-hidden="true" className="fixed inset-0 bg-neutral-900" />

      <DialogPanel
        onKeyDown={onKeyDown}
        className="fixed inset-0 flex flex-col text-white"
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onHide}
              aria-label={_STRINGS.CLOSE}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Icon name="x" size={20} />
            </button>
            <div className="flex min-w-0 flex-col">
              <p className="line-clamp-1 text-sm font-bold md:text-base">
                {title}
              </p>
              {hostName ? (
                <p className="line-clamp-1 text-xs text-white/70">
                  {_STRINGS.HOSTED_BY} {hostName}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : (
            <></>
          )}
        </div>

        <div className="relative flex min-h-0 flex-1 items-center">
          <div
            ref={stageRef}
            className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain scroll-smooth"
          >
            {images.map((image, index) => (
              <div
                data-index={index}
                key={`photo-${image?.id}`}
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                className="relative flex h-full w-full min-w-full snap-center items-center justify-center p-4"
              >
                <PropertyImageDownloadButton attachmentId={image?.id} />
                <TransformWrapper
                  limitToBounds
                  disablePadding
                  panning={{ disabled: true }}
                >
                  <TransformComponent>
                    <ContentImage
                      width={1600}
                      height={1200}
                      sizes="100vw"
                      alt={alt || ""}
                      priority={index === (startIndex ?? 0)}
                      quality={PROPERTY_DETAIL_IMAGE_QUALITY}
                      src={getPropertyImageUrl(image, "name")}
                      loading={index === (startIndex ?? 0) ? undefined : "lazy"}
                      className="max-h-[calc(100dvh-13rem)] w-auto object-contain"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label={_STRINGS.NEXT_PAGE}
            disabled={activeIndex >= lastIndex}
            onClick={() => goTo(activeIndex + 1)}
            className="absolute left-4 hidden size-12 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30 md:flex"
          >
            <Icon name="chevron-left" size={24} />
          </button>
          <button
            type="button"
            disabled={activeIndex <= 0}
            onClick={() => goTo(activeIndex - 1)}
            aria-label={_STRINGS.PREVIOUS_PAGE}
            className="absolute right-4 hidden size-12 rotate-180 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 disabled:opacity-30 md:flex"
          >
            <Icon name="chevron-left" size={24} />
          </button>
        </div>

        <div className="shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <p
            aria-live="polite"
            className="pb-2 text-center text-xs text-white/70"
          >
            {activeIndex + 1} {_STRINGS.PHOTO_OF} {images.length}
          </p>
          <div className="flex gap-2 overflow-x-auto px-4 pb-1">
            {images.map((image, index) => (
              <button
                type="button"
                key={`thumb-${image?.id}`}
                onClick={() => goTo(index)}
                aria-current={index === activeIndex}
                aria-label={`${alt || ""} ${index + 1}`}
                ref={(node) => {
                  thumbRefs.current[index] = node;
                }}
                className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-10 transition-opacity md:h-20 md:w-28 ${
                  index === activeIndex
                    ? "opacity-100 ring-2 ring-brand-400"
                    : "opacity-60 hover:opacity-90"
                }`}
              >
                <ContentImage
                  fill
                  alt=""
                  sizes="112px"
                  className="object-cover"
                  src={getPropertyImageUrl(image, "thumbnail")}
                  fallbackSrc={getPropertyImageUrl(image, "name")}
                />
              </button>
            ))}
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default PropertyPhotoViewer;
