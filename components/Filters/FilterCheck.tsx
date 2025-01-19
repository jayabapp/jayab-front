"use client";
import React, { Dispatch } from "react";
import Counter from "../shared/Form/Counter";
import { usePathname, useRouter } from "next/navigation";
import queryBuilder from "@/helpers/queryBuilder";
import Checkbox from "../shared/Form/Checkbox";

const FilterCheck = ({
  title,
  query,
  queryKey,
  setMobileFilters,
  mobileFilters,
  withBadge,
}: {
  query?: any;
  queryKey: number | string;
  setMobileFilters?: Dispatch<any>;
  mobileFilters?: any;
  withBadge?: boolean;
  title: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const queyData =
    !!mobileFilters && (mobileFilters[queryKey] || mobileFilters[queryKey] == 0)
      ? Number(mobileFilters[queryKey])
      : Number(query[queryKey])
      ? `${query[queryKey]}`?.split(",")
      : "";

  const queryMaker = (value: string | number) => {
    let temp = mobileFilters ? { ...mobileFilters } : { ...query };
    const body = {
      ...temp,

      [queryKey]: value,
    };
    if (queryKey == "parent_category") {
      delete body.specifications;
      delete body.categories;
    }
    if (temp[queryKey] == 0) {
      delete body[queryKey];
    }

    if (!!setMobileFilters) {
      console.log(body, "bodybody");
      setMobileFilters(body);
    } else {
      router.replace(`${pathname}?${queryBuilder(body)}`);
    }
  };
  return (
    <div className=" w-full py-2 gap-2 flex items-center justify-start     ">
      <Checkbox
        containerClass="w-fit"
        onSelect={() => {
          queryMaker(queyData == 1 ? 0 : 1);
        }}
        title={title}
        isChecked={queyData == 1 ? true : false}
      />
      {!!withBadge ? <img className="w-4 h-4 aspect-square " src="/assets/icons/adds/verified_badge.svg" /> : <></>}
    </div>
  );
};

export default FilterCheck;
