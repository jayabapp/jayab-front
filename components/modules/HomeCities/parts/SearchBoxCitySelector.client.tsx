"use client";

import type { TSearchBoxProps } from "@/types/components/elements/LinearData";
import { CityModal } from "@modules/CitySelector";
import { ContentImage } from "@elements/Image";
import { Suspense, useState } from "react";

const SeachBoxCitySelector = ({ options, onSubmitCB }: TSearchBoxProps) => {
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
        className={` px-0 pb-0 pt-4 w-full relative flex cursor-pointer items-center shrink-0 gap-2   border-t  `}
      >
        <div className=" rounded-md   bg-neutral-50  size-10  flex items-center  justify-center  border ">
          <ContentImage
            alt=""
            height={20}
            width={20}
            src="/assets/icons/home/home_location.svg"
            className={` size-5 aspect-auto ${!!title ? "   text-black opacity-70 " : "opacity-40"}`}
          />{" "}
        </div>

        <div className="flex flex-col items-start justify-start gap-1 ">
          <p className="text-sm font-bold">لیست شهرها</p>
          <p className="text-xxs ">لیست تمامی شهرها و استان ها</p>
        </div>

        <ContentImage
          alt=""
          width={12}
          height={12}
          className="size-3 absolute left-0"
          src="/assets/icons/shared/chevron-left.svg"
        />
      </div>
      <Suspense>
        {" "}
        <CityModal
          isHome
          show={showCities}
          setTitle={setTitle}
          passedUrl={"/rooms"}
          onHide={onHideCities}
          onSubmitExtendedCB={onSubmitCB}
        />
      </Suspense>{" "}
    </div>
  );
};

export default SeachBoxCitySelector;
