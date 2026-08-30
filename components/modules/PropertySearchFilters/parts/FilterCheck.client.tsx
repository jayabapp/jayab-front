"use client";

import type { FilterCheckProps } from "@/types/components/modules/property-search-filters";
import { usePathname, useRouter } from "next/navigation";
import { ContentImage } from "@elements/Image";
import { Checkbox } from "@elements/Form";

import queryBuilder from "@/helpers/queryBuilder";

const FilterCheck = ({
  query,
  title,
  queryKey,
  withBadge,
  mobileFilters,
  setMobileFilters,
}: FilterCheckProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const isChecked =
    mobileFilters && (mobileFilters[queryKey] || mobileFilters[queryKey] === 0)
      ? Number(mobileFilters[queryKey]) === 1
      : Number(query?.[queryKey]) === 1;

  const queryMaker = (value: number) => {
    const source = mobileFilters ? { ...mobileFilters } : { ...query };
    const body: Record<string, unknown> = { ...source, [queryKey]: value };
    if (queryKey === "parent_category") {
      delete body.specifications;
      delete body.categories;
    }
    if (source[queryKey] === 0) delete body[queryKey];

    if (setMobileFilters) setMobileFilters(body);
    else router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className="w-full py-2 gap-2 flex items-center justify-start">
      <Checkbox
        title={title}
        isChecked={isChecked}
        containerClass="w-fit"
        onSelect={() => queryMaker(isChecked ? 0 : 1)}
      />
      {withBadge ? (
        <ContentImage
          width={16}
          height={16}
          alt="verified_badge"
          className="w-4 h-4 aspect-square"
          src="/assets/icons/adds/verified_badge.svg"
        />
      ) : null}
    </div>
  );
};

export default FilterCheck;
