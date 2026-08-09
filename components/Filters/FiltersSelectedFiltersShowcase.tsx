import { Dispatch, Fragment, SetStateAction } from "react";
import { sortDynamicFiltersInOrder } from "@/utils/constantss";
import { usePathname, useRouter } from "next/navigation";
import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { ChildCities } from "@/api_services/city/city.interface";

import SelectiveFilterShowCase from "./SelectiveFilterShowCase";
import numberWithCommas from "@/helpers/numberWithCommas";
import RegionButton from "../CityModal/RegionButton";
import queryBuilder from "@/helpers/queryBuilder";
import SwiperSlide from "../embelaCarousel/SwiperSlide";
import _STRINGS from "@/utils/LocalStrings";
import indexOf from "lodash/indexOf";
import isEmpty from "lodash/isEmpty";
import moment from "moment-jalaali";
import Swiper from "../embelaCarousel/Swiper";

const FiltersSelectedFiltersShowcase = ({
  query,
  propertyTypes,
  containerClass,
  setShowRegions,
  cityWithRegions,
  setFilterModalShow,
}: {
  propertyTypes: {
    [key: string]: ProvienceTypesDto[];
  };
  query: any;
  setFilterModalShow: Dispatch<SetStateAction<boolean>>;
  hiddenFilters?: string[];
  containerClass?: string;
  setShowRegions: Dispatch<SetStateAction<boolean>>;
  cityWithRegions: ChildCities | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const regionsIds = query?.regions?.split(",")?.filter((f: any) => !!f);

  const queryMakerItem = (item: any, queryKey: string) => {
    let temp = { ...query };
    const body = {
      ...temp,
    };
    if (!!item) body[queryKey] = item;
    else delete body[queryKey];
    delete body.page;
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const onFilterAddClick = (value: any, key: string) => {
    queryMakerItem(value, key.toLowerCase());
  };

  const removeFiltersKeys = (array: string[]) => {
    let temp = { ...query };
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      delete temp[element];
    }
    delete temp.page;
    const body = {
      ...temp,
    };
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };
  // Always false for now, but the six call sites still pass the filter key they
  // are asking about, and `hiddenFilters` is still on the props type — so keep
  // accepting it rather than stripping the argument from every caller.
  const isHiddenFilter = (key?: string) => {
    return false;
  };

  const dynamicPropsInQueryKeys = Object.keys(propertyTypes);
  const filteredDynamicPropsInQueryKeys = dynamicPropsInQueryKeys?.filter(
    (e) => !["PARTY", "PET"].includes(e) && !isHiddenFilter(e?.toLowerCase()),
  );
  const sortFilteredDynamicPropsInQueryKeys = filteredDynamicPropsInQueryKeys
    .sort((a, b) =>
      indexOf(sortDynamicFiltersInOrder, a) >
      indexOf(sortDynamicFiltersInOrder, b)
        ? 1
        : -1,
    )
    .sort((a, b) => (!!query[a.toLowerCase()] ? -1 : 1));
  const dynamicKeysLenght = sortFilteredDynamicPropsInQueryKeys?.filter(
    (e) => !!query[e?.toLowerCase()],
  )?.length;

  return (
    <Swiper autoFit parentClass={containerClass}>
      <SwiperSlide className=" z-5  flex lg:hidden !w-auto  ">
        <div
          onClick={() => {
            setFilterModalShow(true);
          }}
          className=" col-span-3 flex   w-fit px-3  h-[1.625rem]  rounded-full   bg-primary-700 items-center gap-2 "
        >
          <img
            src="/assets/icons/property/white_filter_icon.svg"
            className="   cursor-pointer w-3 h-3 shrink-0"
          />
          <p className="text-white  text-xs">{`سایر ${_STRINGS.FILTERS}`}</p>
        </div>
      </SwiperSlide>

      {!isEmpty(cityWithRegions?.child) ? (
        <SwiperSlide className="!w-auto flex lg:hidden ">
          <RegionButton
            containerClass=""
            regionsIds={regionsIds}
            setShowRegions={setShowRegions}
            removeFiltersKeys={removeFiltersKeys}
          />
        </SwiperSlide>
      ) : (
        <></>
      )}
      {!isHiddenFilter("total_bedrooms") && !!query?.total_bedrooms ? (
        <SwiperSlide key={`selecRooms`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.ROOM_COUNT} : {query?.total_bedrooms}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["total_bedrooms"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/*  GUESTS */}
      {!isHiddenFilter("total_guests") && !!query?.total_guests ? (
        <SwiperSlide key={`selecGuests`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.PPL_COUNT} : {query?.total_guests}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["total_guests"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {!!query?.checkout && !!query?.checkin ? (
        <SwiperSlide key={`selecDATE`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.FROM} {moment(query?.checkin).format("jDD/jMMMM/jYYYY")}{" "}
              {_STRINGS.TO} {moment(query?.checkout).format("jDD/jMMMM/jYYYY")}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["checkout", "checkin"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* COMMISION FILTER */}
      {!!query?.max_commission && !!query?.min_commission ? (
        <SwiperSlide key={`selecCommiss`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.COMMIS_JUST_PERC} {_STRINGS.FROM}{" "}
              {numberWithCommas(query?.min_commission)}% {_STRINGS.TO}{" "}
              {numberWithCommas(query?.max_commission)}%
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["max_commission", "min_commission"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/* PRICE FILTER */}
      {!!query?.max_price && !!query?.min_price ? (
        <SwiperSlide key={`selecPRICE`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.PRICE} {_STRINGS.FROM}{" "}
              {numberWithCommas(query?.min_price)} {_STRINGS.TO}{" "}
              {numberWithCommas(query?.max_price)} {_STRINGS.TOMAN}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["max_price", "min_price"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/*  AREA */}
      {!!query?.max_building_area && !!query?.min_building_area ? (
        <SwiperSlide key={`selecAREA`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">
              {_STRINGS.ROOM_SIZE} {_STRINGS.FROM} {query?.min_building_area}{" "}
              {_STRINGS.TO} {query?.max_building_area} {_STRINGS.METER}
            </p>
            <div
              onClick={() => {
                removeFiltersKeys(["max_building_area", "min_building_area"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}
      {/*  HAS DISCOUNT */}
      {!isHiddenFilter("has_discount") &&
      !!query?.has_discount &&
      query?.has_discount == "1" ? (
        <SwiperSlide key={`selecDiscount`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">{_STRINGS.HAS_DISCOUNT}</p>
            <div
              onClick={() => {
                removeFiltersKeys(["has_discount"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}

      {/*  HAS DISCOUNT */}
      {!isHiddenFilter("is_premium") &&
      !!query?.is_premium &&
      query?.is_premium == "1" ? (
        <SwiperSlide key={`selecPermium`} className="!w-auto    ">
          <div className="rounded-full !w-auto   gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs ">
            <p className="text-xs pr-2">{_STRINGS.PERMIUM_PROPS}</p>
            <div
              onClick={() => {
                removeFiltersKeys(["is_premium"]);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2 h-2 rotate-45 aspect-square "
              />
            </div>
          </div>
        </SwiperSlide>
      ) : (
        <></>
      )}

      {[
        { key: "party", title: _STRINGS.PARTY },
        { key: "pet", title: _STRINGS.PET },
      ].map((rule) =>
        !isHiddenFilter(rule.key) && query?.[rule.key] ? (
          <SwiperSlide key={`selected-${rule.key}`} className="!w-auto">
            <div className="rounded-full !w-auto gap-4 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700 bg-primary-700/5 text-primary-700 text-xs">
              <p className="text-xs pr-2">{rule.title}</p>
              <div
                onClick={() => removeFiltersKeys([rule.key])}
                className="cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
              >
                <img
                  src="/assets/icons/adds/blue_plus.svg"
                  className="w-2 h-2 rotate-45 aspect-square"
                />
              </div>
            </div>
          </SwiperSlide>
        ) : null,
      )}

      {sortFilteredDynamicPropsInQueryKeys?.map((key, index) => {
        const STRINGS: any = { ..._STRINGS };

        return (
          <Fragment key={`wrapper${key}`}>
            <SwiperSlide className={`!w-auto`} key={`selectedItems${key}`}>
              <SelectiveFilterShowCase
                query={query}
                queryKey={key?.toLowerCase()}
                removeFiltersKeys={removeFiltersKeys}
                list={propertyTypes?.[key?.toUpperCase()]}
                title={STRINGS?.[key?.toUpperCase()] || ""}
              />
            </SwiperSlide>

            {(!!dynamicKeysLenght && dynamicKeysLenght - 1 == index) ||
            (!dynamicKeysLenght && index == 0) ? (
              <SwiperSlide key={`hasPool`} className={`!w-auto  `}>
                <div
                  onClick={() => {
                    onFilterAddClick(1, "has_pool");
                  }}
                  className={` cursor-pointer ${!!query?.has_pool ? "" : " grayscale opacity-70"} rounded-full !w-auto   gap-0 py-1 h-[1.625rem] px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs `}
                >
                  <p className="text-xs px-2">
                    {query?.has_pool == "0" ? "بدون استخر" : "  استخردار"}
                  </p>
                  {!!query?.has_pool ? (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFiltersKeys(["has_pool"]);
                      }}
                      className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
                    >
                      <img
                        src="/assets/icons/adds/blue_plus.svg"
                        className="w-2 h-2 rotate-45 aspect-square "
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </SwiperSlide>
            ) : (
              <></>
            )}
          </Fragment>
        );
      })}
    </Swiper>
  );
};

export default FiltersSelectedFiltersShowcase;
