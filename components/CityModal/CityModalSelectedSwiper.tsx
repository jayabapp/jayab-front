import { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import { useEffect, useState } from "react";
import Swiper from "../embelaCarousel/Swiper";
import SwiperSlide from "../embelaCarousel/SwiperSlide";

const CityModalSelectedSwiper = ({
  selectedCities,
  onCityClick,
  provinces,
  onProvCancelClick,
  clearSelected,
}: {
  selectedCities: any[];
  onCityClick: (item: NewCitiesListDto | ChildCities) => void;
  onProvCancelClick: (item: NewCitiesListDto) => void;
  clearSelected: () => void;
  provinces: NewCitiesListDto[] | undefined;
}) => {
  const [selectedProvs, setSelectedProves] = useState<NewCitiesListDto[] | undefined>([]);

  useEffect(() => {
    if (!!provinces) {
      const copiedProvs = JSON.parse(JSON.stringify([...provinces]));
      setSelectedProves(
        copiedProvs
          ?.filter((e: any) => e?.child?.some((f: any) => selectedCities?.some((x) => x?.id == f?.id)))
          ?.map((e: any) => ({
            ...e,
            child: e?.child?.filter((f: any) => selectedCities?.some((x) => x?.id == f?.id)),
          })),
      );
    }
  }, [provinces, selectedCities]);
  return (
    <div className=" flex flex-col gap-2 ">
      <div
        className={`${!isEmpty(selectedProvs) ? " h-fit opacity-100" : " h-0 opacity-0"} flex flex-row items-center justify-between  transition-all`}
      >
        {" "}
        <p className=" ">{`${_STRINGS.SELECTED_CITIES}  ${!isEmpty(selectedCities) ? `(${selectedCities?.length} شهر)` : ""} `}</p>
        <div onClick={clearSelected} className="  cursor-pointer flex items-center gap-1   ">
          <img className="size-4  opacity-40 " src="/assets/icons/uploader/TrashIcon.svg" />
          <p className="text-sm text-neutral-400">حذف همه</p>
        </div>
      </div>

      <Swiper autoFit>
        {!!selectedProvs && selectedProvs.length > 0 ? (
          selectedProvs.map((val, index) => {
            const selectedMainProv = provinces?.find((x) => x?.id == val?.id);
            if (selectedMainProv?.child?.length == val?.child?.length) {
              return (
                <SwiperSlide key={`selectedItemsPROv${val?.id || val}`} className=" ">
                  <div className="rounded-full gap-4 py-0.5 px-1 flex items-center justify-center border border-brand-600/30  bg-brand-600/5  text-xs">
                    <p className="text-sm text-neutral-900  font-medium  pr-2">
                      {" "}
                      {_STRINGS.PROVINCE} {val?.title}{" "}
                    </p>
                    <div
                      onClick={() => {
                        onProvCancelClick(val);
                      }}
                      className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600/30  flex items-center justify-center"
                    >
                      <img
                        src="/assets/icons/adds/x_mark.svg"
                        className="w-2.5 h-2.5    opacity-30 p-0.5  text-neutral-900 aspect-square "
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            } else
              return val?.child?.map((e) => (
                <SwiperSlide key={`selectedItems${e?.id || e?.title}`}>
                  <div className="rounded-full gap-4 py-0.5 px-1 flex items-center justify-center border border-brand-600/30  bg-brand-600/5  text-xs ">
                    <p className="text-sm text-neutral-900   pr-2">{e?.title} </p>
                    <div
                      onClick={() => {
                        onCityClick(e);
                      }}
                      className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600/30  flex items-center justify-center"
                    >
                      <img
                        src="/assets/icons/adds/x_mark.svg"
                        className="w-2.5 h-2.5    opacity-30 p-0.5  text-neutral-900 aspect-square "
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ));
          })
        ) : (
          <></>
        )}
      </Swiper>
    </div>
  );
};

export default CityModalSelectedSwiper;
