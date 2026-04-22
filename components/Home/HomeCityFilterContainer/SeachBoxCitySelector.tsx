"use client";
import CityModal from "@/components/CityModal";
import _STRINGS from "@/utils/LocalStrings";
import { Suspense, useState } from "react";

const SeachBoxCitySelector = ({
  options,
  onSubmitCB,
}: {
  onSubmitCB: () => void | null;
  options?: { cotainerClass?: string };
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
    <div
      className={` px-4 w-full relative flex cursor-pointer items-center shrink-0  ${options?.cotainerClass || ""} `}
    >
      {" "}
      <div
        onClick={onShowCities}
        className={` px-4 py-2 w-full relative flex cursor-pointer items-center shrink-0 gap-2   border-y  `}
      >
        <div className=" rounded-md flex items-center  justify-center  border size-7">
          <img
            src="/assets/icons/home/home_location.svg"
            className={`h-4 aspect-auto ${!!title ? "   text-black opacity-70 " : "opacity-40"}`}
          />{" "}
        </div>

        <p
          className={`   text-sm md:text-base md:font-medium shrink-0  ${!!title ? "text-black opacity-70" : " text-black opacity-40"}  `}
        >
          {_STRINGS.SELECT_CITY}
        </p>

        <img className="size-3 absolute left-4 " src="/assets/icons/shared/chevron-left.svg" />
      </div>
      <Suspense>
        {" "}
        <CityModal
          onSubmitExtendedCB={onSubmitCB}
          // customeValues={{
          //   cities: locationsData?.cities?.map((e: any) => e?.id),
          //   provinces: locationsData?.provinces?.map((e: any) => e?.id)?.join(","),
          // }}
          isHome
          setTitle={setTitle}
          onHide={onHideCities}
          show={showCities}
          passedUrl={"/rooms"}
        />
      </Suspense>{" "}
    </div>
  );
};

export default SeachBoxCitySelector;
