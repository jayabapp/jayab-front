"use client";

import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import { useEffect, useRef, useState } from "react";
import { useSimilarProperties } from "@features/properties/hooks/useSimilarProperties";

import type { TSimilarPropertiesProps } from "@/types/components/modules/property-details";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import _STRINGS from "@/utils/LocalStrings";
import Swiper from "@elements/Carousel/Swiper.client";

const SKELETON_SLOTS = [0, 1, 2];
const BREAKPOINTS = {
  320: { slidesPerView: 1.15, spaceBetween: 12 },
  640: { slidesPerView: 2, spaceBetween: 12 },
  768: { slidesPerView: 2, spaceBetween: 12 },
  1024: { slidesPerView: 3, spaceBetween: 16 },
  1600: { slidesPerView: 3, spaceBetween: 16 },
};

const SimilarProperties = ({ city, propertyId }: TSimilarPropertiesProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data, isLoading } = useSimilarProperties(propertyId, isVisible);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || isVisible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  if (isVisible && !isLoading && !data?.length) return null;
  return (
    <section
      ref={rootRef}
      aria-labelledby="similar-properties-title"
      className="pt-8 pb-4"
    >
      <h2
        id="similar-properties-title"
        className="mb-4 text-base font-bold text-neutral-900 md:text-lg"
      >
        {city
          ? _STRINGS.SIMILAR_STAYS_IN.replace("{city}", city)
          : _STRINGS.SIMILAR_STAYS}
      </h2>
      {isVisible ? (
        <Swiper
          withArrows
          spaceBetween={12}
          slidesPerView={1.15}
          breakPoints={BREAKPOINTS}
        >
          {isLoading
            ? SKELETON_SLOTS.map((slot) => (
                <SwiperSlide key={slot} className="pb-2">
                  <PropertyCardSkeleton />
                </SwiperSlide>
              ))
            : data?.map((item) => (
                <SwiperSlide key={item.id} className="pb-2">
                  <PropertyCard data={item} />
                </SwiperSlide>
              ))}
        </Swiper>
      ) : (
        <div className="h-48" aria-hidden />
      )}
    </section>
  );
};

export default SimilarProperties;
