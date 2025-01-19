import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import queryBuilder from "@/helpers/queryBuilder";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef } from "react";
import SwiperWithNavigation from "../SwiperWithNavigation";
import Swiper from "swiper";
import { SwiperSlide } from "swiper/react";

const FiltersSelectedFiltersShowcase = ({
  query,
  propertyTypes,
}: {
  propertyTypes: {
    [key: string]: ProvienceTypesDto[];
  };

  query: any;
}) => {
  const ref = useRef<Swiper>(null);
  const router = useRouter();
  const pathname = usePathname();
  // const finalizzedKeys = Object.keys(propertyTypes)
  //   ?.filter((e) => !!query?.[e.toLowerCase()])
  //   ?.map((e) => e?.toLowerCase());
  // const valueObjects = finalizzedKeys?.map((e) =>
  //   query?.[e]?.split(",")?.map((x) => propertyTypes[e.toUpperCase()]?.find((z) => z?.id == x))
  // );

  const finallizedSelectedOptions = useMemo(() => {
    let data = [];
    if (!!propertyTypes && query) {
      let objectKeys = Object.keys(propertyTypes)?.map((e) => e?.toLowerCase());

      for (let index = 0; index < objectKeys.length; index++) {
        const element = objectKeys[index];
        if (!!query?.[element]) {
          console.log(query?.[element]?.split(","), "query?.[element]query?.[element]");
          data.push(
            query?.[element]?.split(",")?.map((x: any) => propertyTypes[element.toUpperCase()]?.find((z) => z?.id == x))
          );
        }
      }
    }
    return data;
  }, [propertyTypes, query]);

  const queryMaker = (items: any[], queryKey: string) => {
    let temp = { ...query };
    const body = {
      ...temp,
    };

    if (!!items) {
      body[queryKey] = items?.map((e) => e?.id);
    } else {
      delete body[queryKey];
    }

    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const onFilterClick = (i: any, queyData: any) => {
    let temp: any = [];

    if (queyData?.find((it: any) => it?.id == `${i?.id}`)) {
      temp = queyData?.filter((it: any) => it?.id != `${i?.id}`);
    }

    queryMaker(temp, i?.group.toLowerCase());
  };
  return (
    <SwiperWithNavigation
      reference={ref}
      className=" !max-w-full flex items-center"
      onBeforeInit={(swiper: Swiper) => (ref.current = swiper)}
      dataLength={finallizedSelectedOptions?.flatMap((e) => e)?.length}
      // grid={{
      //   rows: 2,
      //   fill: "row",
      // }}
      slidesPerView={"auto"}
      spaceBetween={10}
    >
      {finallizedSelectedOptions?.map((oneRow) => {
        return oneRow?.map((e: any, index: number) => (
          <SwiperSlide key={`selectedItems${e?.id}`} className="!w-auto    ">
            <div className="rounded-full !w-auto   gap-4 py-1 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
              <p className="text-xs pr-2">{e?.title} </p>
              <div
                onClick={() => {
                  onFilterClick(e, oneRow);
                }}
                className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
              >
                <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
              </div>
            </div>
          </SwiperSlide>
        ));
      })}
    </SwiperWithNavigation>
  );
};

export default FiltersSelectedFiltersShowcase;
