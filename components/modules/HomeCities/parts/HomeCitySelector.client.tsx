"use client";

import { CityModal } from "@modules/CitySelector";
import { Suspense, useState } from "react";

import HomeCitySelectorLabel from "./HomeCitySelectorLabel.client";
import CitySelectorLabelView from "./CitySelectorLabelView";

const HomeCityFilterCityPart = ({
  options,
  isHome,
}: {
  options?: { cotainerClass?: string };
  isHome?: boolean;
}) => {
  const [showCities, setShowCities] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const onHideCities = () => {
    setShowCities(false);
  };
  const onShowCities = () => {
    setShowCities(true);
  };

  return (
    <>
      <div
        onClick={onShowCities}
        className={`flex min-w-0 cursor-pointer items-center shrink-0 gap-2 ${options?.cotainerClass || ""}`}
      >
        <Suspense fallback={<CitySelectorLabelView title={modalTitle} />}>
          <HomeCitySelectorLabel modalTitle={modalTitle} />
        </Suspense>
      </div>
      <Suspense>
        <CityModal
          isHome={isHome}
          show={showCities}
          passedUrl={"/rooms"}
          onHide={onHideCities}
          setTitle={setModalTitle}
        />
      </Suspense>
    </>
  );
};

export default HomeCityFilterCityPart;
