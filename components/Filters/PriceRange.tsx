import { useRouter, usePathname } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { CSSProperties, Dispatch, useEffect, useState } from "react";
import Button from "../shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";

import queryBuilder from "@/helpers/queryBuilder";
import { isNaN } from "lodash";
import numberWithCommas from "@/helpers/numberWithCommas";

type PriceRangeType = {
  query?: any;
  lowLimit?: number;
  steps?: number;
  higherKey: string;
  lowerKey: string;
  upLimit?: number;
  setFilters?: Dispatch<any>;
  filters?: any;
  marks?: { [key: string]: { label: number | string; style: CSSProperties } };
};

const PriceRange = ({ filters, setFilters, query, lowLimit, upLimit, steps, higherKey, lowerKey }: PriceRangeType) => {
  const pathname = usePathname();
  const { min_price, max_price, tag_ids, categories } = query || {};
  const router = useRouter();
  const [lowerBound, SetlowerBound] = useState(lowLimit || 0);
  const [upperBound, SetupperBound] = useState(upLimit || 100000000);
  const [marks, setMarks] = useState<{ [key: number]: { style: {}; label: number } }>([]);

  useEffect(() => {
    if (upLimit) {
      SetupperBound(upLimit);
    }
    if (lowLimit) {
      SetlowerBound(lowLimit);
    }
  }, [lowLimit, upLimit]);

  // useEffect(() => {
  //   setValue([Number(lowerBound), Number(upperBound)]);
  // }, [lowerBound, upperBound]);

  // useQuery(
  //   [ProductsServices?.PRODUCT_PRICE_RANGE_CACHEKEY, businessId, categories, tag_ids],
  //   () =>
  //     ProductsServices?.GetBusinessProductPriceRange({
  //       business_id: businessId,
  //       tag_id: tag_ids ? [tag_ids] : undefined,
  //       category_id: categories ? (typeof categories == "string" ? categories : categories[0]) : undefined,
  //     }),
  //   {
  //     onSuccess: (e) => {
  //       if (e) {
  //         SetupperBound(e?.max_price);
  //         SetlowerBound(e?.min_price);
  //         !min_price && setValue([e?.min_price, e?.max_price]);
  //       }
  //     },
  //   }
  // );

  useEffect(() => {
    var list: { [key: number]: { style: {}; label: number } } = {};

    list[lowerBound] = { style: { color: "#3886E5", bottom: "-2rem" }, label: lowerBound };
    list[upperBound] = { style: { color: "#3886E5", bottom: "-2rem" }, label: upperBound };
    setMarks(list);
  }, [lowerBound, upperBound]);

  const onChangeFunc = (e: any) => {
    if (typeof e === "object" && setFilters) {
      if (e[1] == upperBound && e[0] == lowerBound) {
        setFilters((x: any) => ({
          ...x,
          [lowerKey]: undefined,
          [higherKey]: undefined,
        }));
      } else {
        setFilters((x: any) => ({
          ...x,
          [lowerKey]: e[0] == lowerBound && !x[higherKey] ? undefined : e[0],
          [higherKey]: e[1] == upperBound && !x[lowerKey] ? undefined : e[1],
        }));
      }
    }
  };

  return (
    <div className="mx-2">
      <Slider
        range
        min={lowerBound}
        max={upperBound}
        step={steps || 100000}
        // marks={marks}
        railStyle={{ backgroundColor: "#d1d5db", height: 4 }}
        // reverse
        trackStyle={{ backgroundColor: "#0088CC", height: 4 }}
        handleStyle={{
          backgroundColor: "#3886E5",
          borderWidth: 0,
          width: 20,
          height: 20,
          bottom: -4,
        }}
        activeDotStyle={{
          backgroundColor: "#10264B",
          borderColor: "#10264B",
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        dotStyle={{
          backgroundColor: "#D6D6D6",
          borderColor: "#D6D6D6",
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
          visibility: true ? "visible" : "hidden",
        }}
        value={[filters?.[lowerKey] || lowerBound, filters?.[higherKey] || upperBound]}
        onChange={(e) => {
          onChangeFunc(e);
        }}
        defaultValue={[lowerBound, upperBound]}
      />
    </div>
  );
};

export default PriceRange;
