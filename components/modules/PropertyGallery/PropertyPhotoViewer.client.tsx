"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { PROPERTY_DETAIL_IMAGE_QUALITY } from "@features/properties/constants/image";
import { useOverlayBackButton } from "@/hooks/useOverlayBackButton";
import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useDir } from "@hooks/useDir";
import { Icon } from "@elements/Icon";

import type { PropertyPhotoViewerProps } from "@/types/components/modules/property-gallery";

import PropertyImageDownloadButton from "./parts/PropertyImageDownloadButton.client";

const ARROW_CLASS =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-surface/15 text-white backdrop-blur-sm transition-colors hover:bg-surface/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface/70 disabled:pointer-events-none disabled:opacity-25 md:size-12";

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
  const t = useTranslations();
  const rtl = useDir() === "rtl";

  const [activeIndex, setActiveIndex] = useState(startIndex ?? 0);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const requestClose = useOverlayBackButton(show, onHide);

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

  const lastIndex = images.length - 1;

  useEffect(() => {
    if (!show) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const back = rtl ? "ArrowRight" : "ArrowLeft";
      if (event.key === forward) goTo(Math.min(activeIndex + 1, lastIndex));
      if (event.key === back) goTo(Math.max(activeIndex - 1, 0));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, goTo, lastIndex, rtl, show]);

  if (!show || !images?.length) return <></>;

  return (
    <Dialog
      open={show}
      onClose={requestClose}
      className="fixed inset-0 z-[1000]"
      aria-label={t("listing.photoViewer")}
    >
      <div aria-hidden="true" className="fixed inset-0 bg-black" />

      <DialogPanel className="fixed inset-0 flex flex-col text-white">
        <div className="grid h-14 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 md:h-16 md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={requestClose}
              aria-label={t("common.close")}
              className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface/10 transition-colors hover:bg-surface/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-surface/60"
            >
              <Icon name="x" size={20} />
            </button>
            <div className="hidden min-w-0 flex-col md:flex">
              <p className="line-clamp-1 text-sm font-bold">{title}</p>
              {hostName ? (
                <p className="line-clamp-1 text-xs text-white/60">
                  {t("listing.hostedBy")} {hostName}
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>

          <p
            aria-live="polite"
            className="rounded-full bg-surface/10 px-3 py-1 text-xs font-medium tabular-nums md:text-sm"
          >
            {activeIndex + 1} {t("listing.photoOf")} {images.length}
          </p>

          <div className="flex items-center justify-end gap-2">
            {actions ?? <></>}
            <PropertyImageDownloadButton
              attachmentId={images[activeIndex]?.id}
            />
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div
            ref={stageRef}
            className="flex size-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {images.map((image, index) => (
              <div
                data-index={index}
                key={`photo-${image?.id}`}
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                className="flex size-full min-w-full snap-center items-center justify-center px-2 md:px-20"
              >
                <TransformWrapper
                  limitToBounds
                  disablePadding
                  panning={{ disabled: true }}
                  doubleClick={{ mode: "toggle", step: 1.2 }}
                >
                  <TransformComponent
                    wrapperClass="!size-full"
                    contentClass="!relative !size-full"
                  >
                    <ContentImage
                      fill
                      sizes="100vw"
                      alt={alt || ""}
                      className="object-contain"
                      priority={index === (startIndex ?? 0)}
                      quality={PROPERTY_DETAIL_IMAGE_QUALITY}
                      src={getPropertyImageUrl(image, "name")}
                      loading={index === (startIndex ?? 0) ? undefined : "lazy"}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label={t("common.nextPage")}
            disabled={activeIndex >= lastIndex}
            onClick={() => goTo(activeIndex + 1)}
            className={`${ARROW_CLASS} ${rtl ? "left-2 md:left-5" : "right-2 rotate-180 md:right-5"}`}
          >
            <Icon name="chevron-left" size={24} />
          </button>
          <button
            type="button"
            disabled={activeIndex <= 0}
            onClick={() => goTo(activeIndex - 1)}
            aria-label={t("common.previousPage")}
            className={`${ARROW_CLASS} ${rtl ? "right-2 rotate-180 md:right-5" : "left-2 md:left-5"}`}
          >
            <Icon name="chevron-left" size={24} />
          </button>
        </div>

        <div className="shrink-0 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3">
          <div className="flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] md:justify-center [&::-webkit-scrollbar]:hidden">
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
                className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden rounded-10 transition-all md:h-16 md:w-24 ${
                  index === activeIndex
                    ? "opacity-100 ring-2 ring-surface"
                    : "opacity-50 hover:opacity-90"
                }`}
              >
                <ContentImage
                  fill
                  alt=""
                  sizes="112px"
                  className="object-cover"
                  src={getPropertyImageUrl(image, "name")}
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
