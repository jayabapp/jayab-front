import { useRouter, usePathname } from "next/navigation";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useEffect, useState } from "react";
import Button from "../shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";

import queryBuilder from "@/helpers/queryBuilder";
import { isNaN } from "lodash";
import numberWithCommas from "@/helpers/numberWithCommas";

type PriceRangeType = { callback?: () => void | null; query?: any; lowLimit?: number; upLimit?: number };

const PriceRange = ({ query, callback, lowLimit, upLimit }: PriceRangeType) => {
  const pathname = usePathname();
  const { min_price, max_price, tag_ids, categories } = query || {};
  const router = useRouter();
  const [lowerBound, SetlowerBound] = useState(lowLimit || 0);
  const [upperBound, SetupperBound] = useState(upLimit || 100000000);
  const [marks, setMarks] = useState<{ [key: number]: { style: {}; label: number } }>([]);
  const [value, setValue] = useState([
    Number(min_price) || Number(lowerBound),
    Number(max_price) || Number(upperBound),
  ]);

  useEffect(() => {
    if (upLimit) {
      SetupperBound(upLimit);
    }
    if (lowLimit) {
      SetlowerBound(lowLimit);
    }
  }, [lowLimit, upLimit]);

  useEffect(() => {
    setValue([Number(lowerBound), Number(upperBound)]);
  }, [lowerBound, upperBound]);

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

  // useEffect(() => {
  //   var list: { [key: number]: { style: {}; label: number } } = {};
  //   for (var i = lowerBound; i <= upperBound; i + 100000) {
  //     list[i] = { style: "", label: i };
  //   }
  //   setMarks(list);
  // }, []);

  return (
    <div className="rounded-10 px-2 py-2 my-5 dark:text-neutral-200">
      <div className="my-5 mx-2">
        <Slider
          range
          min={lowerBound}
          max={upperBound}
          step={100000}
          // marks={marks}
          dotStyle={{ borderColor: "#D6D6D6" }}
          activeDotStyle={{ borderColor: "#10264B" }}
          railStyle={{ backgroundColor: "#d1d5db", height: 4 }}
          // reverse
          trackStyle={{ backgroundColor: "#0088CC", height: 4 }}
          handleStyle={{
            borderColor: "#0088CC",
            height: 18,
            width: 18,
            marginTop: -7,
            zIndex: 10,
            backgroundColor: "#0088CC",
            direction: "ltr",
          }}
          value={value}
          onChange={(e) => {
            if (typeof e === "object") setValue(e);
          }}
          defaultValue={[lowerBound, upperBound]}
        />
      </div>

      <div className="flex flex-col text-sm gap-1 mb-8">
        <div className="flex flex-row  gap-2 items-center flex-1">
          <p className="text-sm w-[1.7rem] ">{"_STRINGS?.A23"}</p>

          <div className="w-full flex  items-center justify-start border rounded-full px-4 py-0.5 border-gray-1150  dark:border-zinc-400">
            <input
              value={`${numberWithCommas(Number(value[0]))}`}
              onChange={(e) => {
                let pureVal = e?.target?.value
                  ?.replaceAll(",", "")
                  .replaceAll(".", "")

                  .replaceAll(" ", "");

                if (!isNaN(pureVal)) setValue([Number(pureVal), value[1]]);
              }}
              className="text-xl font-bold  w-full bg-transparent dark:text-white py-2"
            />
            {_STRINGS?.TOMAN}
          </div>
        </div>

        <div className="flex gap-2 flex-row  items-center flex-1">
          <p className="text-sm  w-[1.7rem]">{"_STRINGS?.A24"}</p>
          <div className="w-full flex items-center justify-start border rounded-full px-4 py-0.5 border-gray-1150  dark:border-zinc-400">
            {/* <p color="text-sm">{numberWithCommas(Number(value[1]))} €</p> */}
            {/* <FormInput
              onChangeText={(e) => {
                let pureval = e?.replace(",", "").replace(".", "");
                console.log(e, pureval, "ssssssssssssssssss");
                if (!isNaN(pureval)) setValue([value[0], pureval]);
              }}
              value={numberWithCommas(Number(value[1]))}
            /> */}
            <input
              value={`${numberWithCommas(Number(value[1]))}`}
              onChange={(e) => {
                let pureVal = e?.target?.value?.replaceAll(",", "").replaceAll(".", "");

                if (!isNaN(pureVal)) setValue([value[0], Number(pureVal)]);
              }}
              className="text-xl font-bold  w-full bg-transparent dark:text-white py-2"
            />{" "}
            {_STRINGS?.TOMAN}
          </div>
        </div>
      </div>

      <div className="my-3 gap-4 flex">
        <Button
          variant="solid"
          title={"_STRINGS?.A25"}
          onClick={() => {
            let temp = { ...query };
            router.replace(
              `${pathname}?${queryBuilder({
                ...temp,
                min_price: value[0],
                max_price: value[1],
              })}`
            );
            if (typeof callback === "function") {
              callback();
            }
          }}
          width="w-full"
          containerClass="w-full flex items-center flex-col ml-2"
        />
        <Button
          title={"_STRINGS?.A26"}
          width="w-full"
          variant={"outline"}
          containerClass="w-full flex items-center flex-col"
          onClick={() => {
            let temp = { ...query };

            delete temp.min_price;
            delete temp.max_price;
            router.replace(
              `${pathname}?${queryBuilder({
                ...temp,
              })}`
            );
            setValue([lowerBound, upperBound]);
            if (typeof callback === "function") {
              callback();
            }
          }}
        />
      </div>
    </div>
  );
};

export default PriceRange;
