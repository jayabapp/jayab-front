"use client";
import CityModal from "@/components/CityModal";
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
        className={` px-0 py-2 w-full relative flex cursor-pointer items-center shrink-0 gap-2   border-t  `}
      >
        <div className=" rounded-md   bg-gray-50  size-10  flex items-center  justify-center  border ">
          <img
            src="/assets/icons/home/home_location.svg"
            className={` size-5 aspect-auto ${!!title ? "   text-black opacity-70 " : "opacity-40"}`}
          />{" "}
        </div>

        <div className="flex flex-col items-start justify-start gap-1 ">
          <p className="    text-sm   font-bold">لیست شهرها</p>
          <p className="    text-xxs ">لیست تمامی شهرها و استان ها</p>
        </div>

        <img className="size-3 absolute left-0 " src="/assets/icons/shared/chevron-left.svg" />
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
