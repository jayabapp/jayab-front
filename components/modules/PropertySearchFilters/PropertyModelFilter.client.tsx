"use client";

import type { PropertyModelFilterProps } from "@/types/components/modules/property-search-filters";
import { usePathname, useRouter } from "next/navigation";
import { Checkbox } from "@elements/Form";

import queryBuilder from "@/helpers/queryBuilder";
import isArray from "lodash/isArray";

/** Checkbox list for one property-attribute filter, writing either the URL or a draft. */
const PropertyModelFilter = ({
  isMulty,
  list,
  mobileFilters,
  onClickCb,
  query,
  queryKey,
  setMobileFilters,
}: PropertyModelFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const selectedValues =
    mobileFilters && mobileFilters[queryKey]
      ? `${mobileFilters[queryKey]}`.split(",")
      : query?.[queryKey]
        ? `${query[queryKey]}`.split(",")
        : "";

  const queryMaker = (items: string | string[]) => {
    const current = mobileFilters ? { ...mobileFilters } : { ...query };
    const body: Record<string, any> = { ...current, [queryKey]: items };
    if (queryKey === "parent_category") {
      delete body.specifications;
      delete body.categories;
    }
    if (current[queryKey] === items) delete body[queryKey];
    delete body.page;
    if (setMobileFilters) setMobileFilters(body);
    else router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const isSelected = (item: any) => {
    if (isMulty && selectedValues)
      return selectedValues.some((value: string) => value === `${item?.id}`);
    if (mobileFilters) return mobileFilters[queryKey] === item?.id;
    return query?.[queryKey] === item?.id;
  };

  return (
    <div className="w-full my-2">
      {list?.map((item) => (
        <div key={`model-${item?.id}`} className="flex items-center my-2 gap-2">
          <Checkbox
            containerClass="w-fit"
            isChecked={isSelected(item)}
            title={<span className="text-sm">{item?.title}</span>}
            rounded={isMulty ? "rounded-md" : "rounded-full"}
            onSelect={() => {
              let next: string | string[] = selectedValues;
              if (isArray(selectedValues) && isMulty) {
                next = selectedValues.some((value: string) => value === `${item?.id}`)
                  ? selectedValues.filter((value: string) => value !== `${item?.id}`)
                  : [...selectedValues, `${item?.id}`];
              } else if (selectedValues && isMulty) {
                next = [selectedValues as unknown as string, `${item?.id}`];
              } else {
                next = `${item?.id}`;
              }
              queryMaker(next);
              onClickCb?.();
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyModelFilter;
