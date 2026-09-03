"use client";

import type { FilterSectionProps } from "@/types/components/modules/property-search-filters";
import { ContentImage } from "@elements/Image";
import { useId, useState } from "react";

/**
 * One collapsible group inside the filter panel.
 *
 * Written rather than reused from `SimpleAccordion` because this needs two
 * things that one does not have: a count of how many values inside are picked —
 * without it a collapsed section hides the fact that it is filtering anything —
 * and a real disclosure contract (`button` + `aria-expanded` + `aria-controls`)
 * so the panel can be operated from the keyboard. `SimpleAccordion` also runs
 * its title through `dangerouslySetInnerHTML`, which these plain labels have no
 * use for.
 *
 * A section that holds a choice opens itself, so a filter arriving from the URL
 * is never hidden behind a closed header the user has no reason to open.
 */
const FilterSection = ({
  children,
  count = 0,
  defaultOpen,
  title,
}: FilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(!!defaultOpen || count > 0);
  const panelId = useId();

  return (
    <section className="w-full border-b border-neutral-100 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-2 py-3.5 text-right"
        >
          <span className="flex items-center gap-2">
            <span className="text-sm font-medium text-neutral-800">{title}</span>
            {count > 0 ? (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 text-xxs font-bold text-white">
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

      {/* Kept mounted and hidden rather than unmounted: the draft lives in the
          parent, but a collapsed section that re-mounts would reset the scroll
          position of a long amenity list every time it is reopened. */}
      <div id={panelId} hidden={!isOpen} className="pb-3">
        {children}
      </div>
    </section>
  );
};

export default FilterSection;
