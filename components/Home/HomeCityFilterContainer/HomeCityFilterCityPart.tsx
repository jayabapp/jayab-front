"use client";
import CityModal from "@/components/CityModal";
import _STRINGS from "@/utils/LocalStrings";
import { Suspense, useState } from "react";

const HomeCityFilterCityPart = () => {
  const [showCities, setShowCities] = useState(false);

  const onHideCities = () => {
    setShowCities(false);
  };
  const onShowCities = () => {
    setShowCities(true);
  };

  return (
    <>
      {" "}
      <div onClick={onShowCities} className=" flex cursor-pointer items-center shrink-0 gap-2">
        <p className=" font-normal md:font-bold text-sm  shrink-0 text-primary-700 ">{_STRINGS.SEE_CITIES}</p>
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
        <CityModal isHome onHide={onHideCities} show={showCities} passedUrl={"/rooms"} />
      </Suspense>{" "}
    </>
  );
};

export default HomeCityFilterCityPart;
