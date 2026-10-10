"use client";

import { useId, useState } from "react";
import { ContentImage } from "@elements/Image";

import type { FilterSectionProps } from "@/types/components/modules/property-search-filters";

const FilterSection = ({
  title,
  children,
  count = 0,
  defaultOpen,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(!!defaultOpen || count > 0);
  const panelId = useId();

  return (
    <section className="w-full border-b border-surface-muted last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-2 py-3.5 text-right"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink">{title}</span>
            {count > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-action px-1.5 text-xxs font-bold text-on-action">
                {count}
              </span>
            ) : (
              <></>
            )}
          </span>
          <ContentImage
            alt=""
            width={16}
            height={16}
            src="/assets/icons/shared/chevron.svg"
            className={`aspect-square w-4 shrink-0 object-contain transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>

      <div id={panelId} hidden={!isOpen} className="pb-3">
        {children}
      </div>
    </section>
  );
};

export default FilterSection;
