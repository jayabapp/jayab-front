"use client";

import type { SpecialFilterButtonsProps } from "@/types/components/modules/property-search-filters";
import { usePathname, useRouter } from "next/navigation";
import { FiltersEnum } from "@/enum/filters.enum";

import SpecialFilterButton from "./parts/SpecialFilterButton";
import queryBuilder from "@/helpers/queryBuilder";
import _STRINGS from "@/utils/LocalStrings";

const SPECIAL_FILTERS = [
  {
    key: FiltersEnum.HAS_BLUE_TICK,
    img: "/assets/icons/adds/verified_hexy_badge.svg",
    title: _STRINGS.PREMIUM,
  },
  {
    key: FiltersEnum.IS_AUTHORIZED,
    img: "/assets/icons/adds/green_circular_tick.svg",
    title: _STRINGS.VERIFIED,
  },
];

const SpecialFilterButtons = ({ containerClass, query }: SpecialFilterButtonsProps) => {
  const { replace } = useRouter();
  const pathname = usePathname();

  const toggle = (key: string, isActive: boolean) => {
    const body: Record<string, unknown> = { ...query };
    if (isActive) delete body[key];
    else body[key] = 1;
    delete body.page;
    replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className={`flex items-center justify-start gap-2 ${containerClass ?? ""}`}>
      {SPECIAL_FILTERS.map((filter) => {
        const isChecked = query?.[filter.key] === "1";
        return (
          <SpecialFilterButton
            key={filter.key}
            isChecked={isChecked}
            item={{ img: filter.img, title: filter.title }}
            cb={() => toggle(filter.key, !!query?.[filter.key])}
          />
        );
      })}
    </div>
  );
};

export default SpecialFilterButtons;
