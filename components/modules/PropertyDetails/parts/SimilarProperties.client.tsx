"use client";

import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import { useEffect, useRef, useState } from "react";
import { useSimilarProperties } from "@features/properties/hooks/useSimilarProperties";

import type { TSimilarPropertiesProps } from "@/types/components/modules/property-details";

import SwiperSlide from "@elements/Carousel/SwiperSlide";
import Swiper from "@elements/Carousel/Swiper.client";

const SimilarProperties = ({
  city,
  seoLinks,
  propertyId,
}: TSimilarPropertiesProps) => {
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
      className="py-8"
    >
      <h2
        id="similar-properties-title"
        className="mb-4 text-base font-bold text-neutral-900 md:text-lg"
      >
        اقامتگاه‌های مشابه{city ? ` در ${city}` : ""}
      </h2>
      {isVisible ? (
        <Swiper
          slidesPerView={1.15}
          breakPoints={{
            640: { slidesPerView: 2, spaceBetween: 12 },
            1024: { slidesPerView: 3, spaceBetween: 16 },
          }}
          spaceBetween={12}
          withArrows
        >
          {(isLoading ? Array.from({ length: 3 }) : data).map((item, index) => (
            <SwiperSlide key={item ? item.id : index} className="pb-2">
              {item ? <PropertyCard data={item} /> : <PropertyCardSkeleton />}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-48" aria-hidden />
      )}
      {isVisible && (seoLinks?.villa || seoLinks?.pool) ? (
        <nav
          aria-label="لینک‌های مرتبط"
          className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm"
        >
          {seoLinks.villa ? (
            <a
              href={`/${seoLinks.villa}`}
              className="text-brand-600 hover:underline"
            >
              اجاره ویلا در {city}
            </a>
          ) : null}
          {seoLinks.pool ? (
            <a
              href={`/${seoLinks.pool}`}
              className="text-brand-600 hover:underline"
            >
              ویلا استخردار در {city}
            </a>
          ) : null}
        </nav>
      ) : null}
    </section>
  );
};

export default SimilarProperties;
