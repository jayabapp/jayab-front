"use client";

import { PropertyCard, PropertyCardSkeleton } from "@modules/PropertyGrid";
import { useEffect, useRef, useState } from "react";
import { useSimilarProperties } from "@features/properties/hooks/useSimilarProperties";
import { useTranslations } from "next-intl";

import type { TSimilarPropertiesProps } from "@/types/components/modules/property-details";

// Two cards only; the city link under them opens the full list.
const CARD_COUNT = 2;
const SKELETON_SLOTS = [0, 1];

const SimilarProperties = ({
  city,
  children,
  propertyId,
}: TSimilarPropertiesProps) => {
  const t = useTranslations("listing");

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

  // No similar stays: the city link still shows.
  if (isVisible && !isLoading && !data?.length)
    return <div className="pb-8">{children}</div>;
  return (
    <section
      ref={rootRef}
      aria-labelledby="similar-properties-title"
      className="border-t border-line pb-8 pt-8 md:pt-10"
    >
      <h2
        id="similar-properties-title"
        className="mb-5 text-lg font-bold leading-8 text-ink md:text-xl md:leading-8"
      >
        {city ? t("similarStaysIn", { city }) : t("similarStays")}
      </h2>
      {isVisible ? (
        <div className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2 md:gap-4">
          {isLoading
            ? SKELETON_SLOTS.map((slot) => <PropertyCardSkeleton key={slot} />)
            : data
                ?.slice(0, CARD_COUNT)
                .map((item) => <PropertyCard key={item.id} data={item} />)}
        </div>
      ) : (
        <div className="h-48" aria-hidden />
      )}
      {children}
    </section>
  );
};

export default SimilarProperties;
