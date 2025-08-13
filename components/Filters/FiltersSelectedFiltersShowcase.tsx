import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import queryBuilder from "@/helpers/queryBuilder";
import { usePathname, useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import SwiperWithNavigation from "../SwiperWithNavigation";
import Swiper from "swiper";
import { SwiperSlide } from "swiper/react";
import _STRINGS from "@/utils/LocalStrings";
import { isMobile } from "react-device-detect";
import numberWithCommas from "@/helpers/numberWithCommas";
import moment from "moment-jalaali";

const FiltersSelectedFiltersShowcase = ({
  query,
  propertyTypes,
  setFilterModalShow,
  hiddenFilters,
}: {
  propertyTypes: {
    [key: string]: ProvienceTypesDto[];
  };

  query: any;
  setFilterModalShow: Dispatch<SetStateAction<boolean>>;
  hiddenFilters?: string[];
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
    let data: any = {};
    if (!!propertyTypes && query) {
      let objectKeys = Object.keys(propertyTypes)?.map((e) => e?.toLowerCase());

      for (let index = 0; index < objectKeys.length; index++) {
        const element = objectKeys[index];
        if (!!query?.[element]) {
          data[element] = query?.[element]
            ?.split(",")
            ?.map((x: any) => propertyTypes[element.toUpperCase()]?.find((z) => z?.id == x));
        }
      }
    }

    return data;
  }, [propertyTypes, query]);
  // const finallizedSelectedOptions = useMemo(() => {
  //   let data = [];
  //   if (!!propertyTypes && query) {
  //     let objectKeys = Object.keys(propertyTypes)?.map((e) => e?.toLowerCase());

  //     for (let index = 0; index < objectKeys.length; index++) {
  //       const element = objectKeys[index];
  //       if (!!query?.[element]) {
  //         data.push(
  //           query?.[element]?.split(",")?.map((x: any) => propertyTypes[element.toUpperCase()]?.find((z) => z?.id == x))
  //         );
  //       }
  //     }
  //   }

  //   return data;
  // }, [propertyTypes, query]);

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

    // router.replace(`/rooms?${queryBuilder(body)}`);
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const onFilterRemoveClick = (i: any, key: string) => {
    let array: any = [];

    array = finallizedSelectedOptions?.[key]?.filter((it: any) => it?.id != `${i?.id}`);
    queryMaker(array, key);
  };

  // const onFilterClick = (i: any, queyData: any) => {
  //   let temp: any = [];

  //   if (queyData?.find((it: any) => it?.id == `${i?.id}`)) {
  //     temp = queyData?.filter((it: any) => it?.id != `${i?.id}`);
  //   }

  //   queryMaker(temp, i?.group.toLowerCase());
  // };

  const removeFiltersKeys = (array: string[]) => {
    let temp = { ...query };

    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      delete temp[element];
    }
    const body = {
      ...temp,
    };
    router.replace(`${pathname}?${queryBuilder(body)}`);
    // router.replace(`/rooms?${queryBuilder(body)}`);
  };
  const isHiddenFilter = (key: string) => {
    return hiddenFilters?.includes(key);
  };
  return (
    <SwiperWithNavigation
      reference={ref}
      className=" !max-w-full md:pb-3 flex items-center"
      onBeforeInit={(swiper: Swiper) => (ref.current = swiper)}
      dataLength={50}
      // grid={{
      //   rows: 2,
      //   fill: "row",
      // }}
      slidesPerView={"auto"}
      spaceBetween={10}
    >
      {isMobile ? (
        <SwiperSlide className="!w-auto ">
          {" "}
          <div
            onClick={() => setFilterModalShow(true)}
            className=" col-span-3 flex   w-fit px-3  h-8  rounded-full   bg-primary-700 items-center gap-2 "
          >
            <img src="/assets/icons/property/white_filter_icon.svg" className="   cursor-pointer w-3 h-3 shrink-0" />
            <p className="text-white  text-xs">{_STRINGS.FILTERS}</p>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* DYNAMIC FILTERS */}
      {!isHiddenFilter("property_type") &&
        finallizedSelectedOptions?.["property_type"]?.map((e: any, index: number) => (
          <SwiperSlide key={`selectedItems${e?.id}`} className="!w-auto    ">
            <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
              <p className="text-xs pr-2">{e?.title} </p>
              <div
                onClick={() => {
                  onFilterRemoveClick(e, "property_type");
                }}
                className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
              >
                <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
              </div>
            </div>
          </SwiperSlide>
        ))}
      {/*  HAS POOL */}
      {/* {!isHiddenFilter("has_pool") && !!query?.has_pool && query?.has_pool != "2" ? ( */}
      {!isHiddenFilter("has_pool") && !!query?.has_pool ? (
        <SwiperSlide key={`hasPool`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.POOL_STATUS} : {query?.has_pool == "0" ? "بدون استخر" : "  استخردار"}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["has_pool"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* DYNAMIC FILTERS */}
      {!isHiddenFilter("pool_type") &&
        finallizedSelectedOptions?.["pool_type"]?.map((e: any, index: number) => (
          <SwiperSlide key={`selectedItems${e?.id}`} className="!w-auto    ">
            <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
              <p className="text-xs pr-2">{e?.title} </p>
              <div
                onClick={() => {
                  onFilterRemoveClick(e, "pool_type");
                }}
                className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
              >
                <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
              </div>
            </div>
          </SwiperSlide>
        ))}
      {/*  BEDROOMS */}
      {!isHiddenFilter("total_bedrooms") && !!query?.total_bedrooms ? (
        <SwiperSlide key={`selecRooms`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.ROOM_COUNT} : {query?.total_bedrooms}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["total_bedrooms"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/*  GUESTS */}
      {!isHiddenFilter("total_guests") && !!query?.total_guests ? (
        <SwiperSlide key={`selecGuests`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.PPL_COUNT} : {query?.total_guests}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["total_guests"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* DYNAMIC FILTERS */}
      {!isHiddenFilter("entertainment") &&
        finallizedSelectedOptions?.["entertainment"]?.map((e: any, index: number) => (
          <SwiperSlide key={`selectedItems${e?.id}`} className="!w-auto    ">
            <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
              <p className="text-xs pr-2">{e?.title} </p>
              <div
                onClick={() => {
                  onFilterRemoveClick(e, "entertainment");
                }}
                className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
              >
                <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
              </div>
            </div>
          </SwiperSlide>
        ))}
      {/* {finallizedSelectedOptions?.map((oneRow) => {
        return oneRow?.map((e: any, index: number) => (
          <SwiperSlide key={`selectedItems${e?.id}`} className="!w-auto    ">
            <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
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
      })} */}
      {/* START END DATE */}
      {!!query?.checkout && !!query?.checkin ? (
        <SwiperSlide key={`selecDATE`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.FROM} {moment(query?.checkin).format("jDD/jMMMM/jYYYY")} {_STRINGS.TO}{" "}
              {moment(query?.checkout).format("jDD/jMMMM/jYYYY")}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["checkout", "checkin"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* COMMISION FILTER */}
      {!!query?.max_commission && !!query?.min_commission ? (
        <SwiperSlide key={`selecCommiss`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.COMMIS_JUST_PERC} {_STRINGS.FROM} {numberWithCommas(query?.min_commission)}% {_STRINGS.TO}{" "}
              {numberWithCommas(query?.max_commission)}%
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["max_commission", "min_commission"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* PRICE FILTER */}
      {!!query?.max_price && !!query?.min_price ? (
        <SwiperSlide key={`selecPRICE`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.PRICE} {_STRINGS.FROM} {numberWithCommas(query?.min_price)} {_STRINGS.TO}{" "}
              {numberWithCommas(query?.max_price)} {_STRINGS.TOMAN}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["max_price", "min_price"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/*  AREA */}
      {!!query?.max_building_area && !!query?.min_building_area ? (
        <SwiperSlide key={`selecAREA`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.ROOM_SIZE} {_STRINGS.FROM} {query?.min_building_area} {_STRINGS.TO} {query?.max_building_area}{" "}
              {_STRINGS.METER}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["max_building_area", "min_building_area"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/*  HAS DISCOUNT */}
      {!isHiddenFilter("has_discount") && !!query?.has_discount && query?.has_discount == "1" ? (
        <SwiperSlide key={`selecDiscount`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">{_STRINGS.HAS_DISCOUNT}</p>
            <div
              onClick={() => {
                removeFiltersKeys(["has_discount"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}

      {/*  HAS DISCOUNT */}
      {!isHiddenFilter("is_premium") && !!query?.is_premium && query?.is_premium == "1" ? (
        <SwiperSlide key={`selecPermium`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-2 h-8 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">{_STRINGS.PERMIUM_PROPS}</p>
            <div
              onClick={() => {
                removeFiltersKeys(["is_premium"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
    </SwiperWithNavigation>
  );
};

export default FiltersSelectedFiltersShowcase;
