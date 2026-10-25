"use client";

import { useDiscoveryQueryReplace } from "@features/properties/hooks/useDiscoveryQueryReplace";
import { useTranslations } from "next-intl";
import { FiltersEnum } from "@/enum/filters.enum";

import type { SpecialFilterButtonsProps } from "@/types/components/modules/property-search-filters";

import SpecialFilterButton from "./parts/SpecialFilterButton";

const SPECIAL_FILTERS = [
  {
    key: FiltersEnum.HAS_DISCOUNT,
    img: "/assets/icons/property/discount_label.svg",
    title: "listing.hasDiscount",
  },
  {
    key: FiltersEnum.HAS_BLUE_TICK,
    img: "/assets/icons/adds/verified_hexy_badge.svg",
    title: "listing.premium",
  },
  {
    key: FiltersEnum.IS_AUTHORIZED,
    img: "/assets/icons/adds/green_circular_tick.svg",
    title: "listing.verified",
  },
] as const;

const SpecialFilterButtons = ({
  query,
  containerClass,
}: SpecialFilterButtonsProps) => {
  const t = useTranslations();
  const replaceQuery = useDiscoveryQueryReplace();

  const toggle = (key: string, isActive: boolean) => {
    const body: Record<string, unknown> = { ...query };
    if (isActive) delete body[key];
    else body[key] = 1;
    replaceQuery(body);
  };

  return (
    <div
      role="group"
      aria-label={t("listing.quickFilters")}
      className={`flex w-max items-center justify-start gap-2 ${containerClass ?? ""}`}
    >
      {SPECIAL_FILTERS.map((filter) => {
        const isChecked = query?.[filter.key] === "1";
        return (
          <SpecialFilterButton
            key={filter.key}
            isChecked={isChecked}
            cb={() => toggle(filter.key, isChecked)}
            item={{ img: filter.img, title: t(filter.title) }}
          />
        );
      })}
    </div>
  );
};

export default SpecialFilterButtons;
