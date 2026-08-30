import type { SelectedCitiesSwiperProps } from "@/types/components/modules/city-selector";
import { ContentImage } from "@elements/Image";
import { useMemo } from "react";

import SwiperSlide from "@/components/embelaCarousel/SwiperSlide";
import Swiper from "@/components/embelaCarousel/Swiper";
import _STRINGS from "@/utils/LocalStrings";
import LocationChip from "./LocationChip";
import isEmpty from "lodash/isEmpty";

const SelectedCitiesSwiper = ({
  clearSelected,
  onCityClick,
  onProvCancelClick,
  provinces,
  selectedCities,
}: SelectedCitiesSwiperProps) => {
  // Regroup the flat selection back under its provinces so a province whose cities
  // are all selected collapses into a single chip.
  const touchedProvinces = useMemo(
    () =>
      (provinces ?? [])
        .filter((province) =>
          province?.child?.some((city) =>
            selectedCities?.some((selected) => selected?.id === city?.id),
          ),
        )
        .map((province) => ({
          ...province,
          child: (province?.child ?? []).filter((city) =>
            selectedCities?.some((selected) => selected?.id === city?.id),
          ),
        })),
    [provinces, selectedCities],
  );

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`${
          isEmpty(touchedProvinces) ? "h-0 opacity-0" : "h-fit opacity-100"
        } flex flex-row items-center justify-between transition-all`}
      >
        <p>
          {`${_STRINGS.SELECTED_CITIES} ${
            isEmpty(selectedCities) ? "" : `(${selectedCities?.length} ${_STRINGS.CITY})`
          }`}
        </p>
        <button
          type="button"
          onClick={clearSelected}
          className="cursor-pointer flex items-center gap-1"
        >
          <ContentImage
            alt=""
            width={16}
            height={16}
            className="size-4 opacity-40"
            src="/assets/icons/uploader/TrashIcon.svg"
          />
          <span className="text-sm text-neutral-400">{_STRINGS.REMOVE_ALL}</span>
        </button>
      </div>

      <Swiper autoFit>
        {touchedProvinces.flatMap((province) => {
          const source = (provinces ?? []).find((entry) => entry?.id === province?.id);
          if (source?.child?.length === province?.child?.length) {
            return [
              <SwiperSlide key={`selected-province-${province?.id}`}>
                <LocationChip
                  title={province?.title}
                  prefix={_STRINGS.PROVINCE}
                  onRemove={() => onProvCancelClick(province)}
                />
              </SwiperSlide>,
            ];
          }
          return (province?.child ?? []).map((city) => (
            <SwiperSlide key={`selected-city-${city?.id}`}>
              <LocationChip title={city?.title} onRemove={() => onCityClick(city)} />
            </SwiperSlide>
          ));
        })}
      </Swiper>
    </div>
  );
};

export default SelectedCitiesSwiper;
