"use client";
import CityModal from "@/components/CityModal";
import { useCitiesStore } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import { Suspense, useState } from "react";

const HomeCityFilterCityPart = ({ options }: { options?: { cotainerClass?: string } }) => {
  const { locationsData } = useCitiesStore();
  const [showCities, setShowCities] = useState(false);

  const onHideCities = () => {
    setShowCities(false);
  };
  const onShowCities = () => {
    setShowCities(true);
  };

  const citiesTitle =
    locationsData?.province?.[0] || !isEmpty(locationsData?.cities)
      ? `${locationsData?.province?.[0] ? `شهر های ${locationsData?.province?.[0]?.title}` : ""} ${
          !!locationsData?.cities && locationsData?.cities?.length > 1 && !locationsData?.province?.[0]
            ? // ? ` ${!!locationsData?.province?.[0] && locationsData?.cities?.length == locationsData?.province?.[0]?.child?.length ? "" : ` و ${locationsData?.cities?.length - (locationsData?.province?.[0]?.child?.length || 1)}  شهر دیگر`} `
              `${locationsData?.cities?.length} ${_STRINGS.CITY}`
            : locationsData?.cities?.length == 1 && !locationsData?.province?.[0]
              ? locationsData?.cities?.[0]?.title
              : ""
        }`
      : _STRINGS.CITY;
  return (
    <>
      {" "}
      <div
        onClick={onShowCities}
        className={` flex cursor-pointer items-center shrink-0 gap-2  ${options?.cotainerClass || ""} `}
      >
        <p
          className={` font-normal md:font-bold text-sm  shrink-0  ${!isEmpty(locationsData?.province) || !isEmpty(locationsData?.cities) ? "text-black opacity-70" : " text-black opacity-40"}  `}
        >
          {citiesTitle}
        </p>
        <img
          src="/assets/icons/home/home_location.svg"
          className={`h-5 aspect-auto ${!isEmpty(locationsData?.province) || !isEmpty(locationsData?.cities) ? "   text-black opacity-70 " : "opacity-40"}`}
        />

        {/* <img
          alt="caret_left"
          className="w-3 h-3 hidden md:flex aspect-square"
          src="/assets/icons/shared/blue_chevron_left.svg"
        />
        <img
          className="w-3 h-3  flex  md:hidden aspect-square"
          src="/assets/icons/shared/skiny_blue_chevron_left.svg"
        /> */}
      </div>
      <Suspense>
        {" "}
        <CityModal
          customeValues={{
            cities: locationsData?.cities?.map((e: any) => e?.id),
            province_id: locationsData?.province?.id,
          }}
          isHome
          onHide={onHideCities}
          show={showCities}
          passedUrl={"/rooms"}
        />
      </Suspense>{" "}
    </>
  );
};

export default HomeCityFilterCityPart;
