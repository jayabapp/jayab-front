"use client";

import { CityModal } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import { Suspense, useState } from "react";

import _STRINGS from "@/utils/LocalStrings";

const HomeCityFilterCityPart = ({
  options,
  isHome,
}: {
  options?: { cotainerClass?: string };
  isHome?: boolean;
}) => {
  const [showCities, setShowCities] = useState(false);
  const [title, setTitle] = useState("");
  const onHideCities = () => {
    setShowCities(false);
  };
  const onShowCities = () => {
    setShowCities(true);
  };

  return (
    <>
      {" "}
      <div
        onClick={onShowCities}
        className={` flex cursor-pointer items-center shrink-0 gap-2  ${options?.cotainerClass || ""} `}
      >
        <p
          className={` font-normal md:font-bold text-sm  shrink-0  ${!!title ? "text-black opacity-70" : " text-black opacity-40"}  `}
        >
          {title || _STRINGS.SELECT_CITY}
        </p>
        <ContentImage
          alt=""
          height={20}
          width={20}
          src="/assets/icons/home/home_location.svg"
          className={`h-5 aspect-auto ${!!title ? "   text-black opacity-70 " : "opacity-40"}`}
        />
      </div>
      <Suspense>
        {" "}
        <CityModal
          isHome={isHome}
          show={showCities}
          setTitle={setTitle}
          passedUrl={"/rooms"}
          onHide={onHideCities}
        />
      </Suspense>{" "}
    </>
  );
};

export default HomeCityFilterCityPart;
