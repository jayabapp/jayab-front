"use client";
import React, { Dispatch } from "react";
import Counter from "../shared/Form/Counter";
import { usePathname, useRouter } from "next/navigation";
import queryBuilder from "@/helpers/queryBuilder";

const FilterCounter = ({
  title,
  query,
  queryKey,
  setMobileFilters,
  mobileFilters,
}: {
  query?: any;
  queryKey: number | string;
  isMulty?: boolean;
  setMobileFilters?: Dispatch<any>;
  mobileFilters?: any;
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
    delete body.page;
    if (!!setMobileFilters) {
      setMobileFilters(body);
    } else {
      router.replace(`${pathname}?${queryBuilder(body)}`);
    }
  };
  return (
    <div className=" w-full py-2 border-b flex items-center justify-between     ">
      <p className="text-sm">{title}</p>

      <div className="w-1/3">
        {" "}
        <Counter
          plusMinusNumber={1}
          value={queyData || 0}
          setValue={(e) => {
            queryMaker(e);
          }}
        />
      </div>
    </div>
  );
};

export default FilterCounter;
