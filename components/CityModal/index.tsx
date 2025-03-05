import React, { useEffect, useState } from "react";
import Modal from "../Modal";
import { useQuery } from "@tanstack/react-query";
import { CityService } from "@/api_services/city/city.service";
import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import LottieLoading from "../shared/Lotties/LottieLoading";
import ProvienceCard from "./ProvienceCard";
import _STRINGS from "@/utils/LocalStrings";
import { isEmpty } from "lodash";
import EmptyList from "../shared/Lotties/EmptyList";
import CityCard from "./CityCard";
import CityModalHeaderPart from "./CityModalHeaderPart";
import CityModalSearchPart from "./CityModalSearchPart";
import CityModalSelectedAccardiom from "./CityModalSelectedAccardiom";
import CityModalAllCitiesButton from "./CityModalAllCitiesButton";
import FixedBottomContainer from "../shared/FixedBottomContainer";
import Button from "../shared/Button/Button";
import useQueryGet from "@/helpers/queryGet";
import { usePathname, useRouter } from "next/navigation";
import queryBuilder from "@/helpers/queryBuilder";
import { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";

const CityModal = ({
  show,
  onHide,
  item,
  setTitle,
  passedUrl,
  onSubmitCustomeCB,
  customeValues,
}: {
  show: boolean;
  onHide: () => void | null;
  setTitle?: (e: string) => void | null;
  item?: { submitTitle?: string };
  passedUrl?: string;
  onSubmitCustomeCB?: (e: any) => void | null;
  customeValues?: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const queriesParams = useQueryGet<any>();
  const [queries, setQueries] = useState<{ [key: string]: any }>({});
  const [selectedProv, setSelectedProv] = useState<NewCitiesListDto | null>(null);
  const [selectedCities, setSelectedCities] = useState<ChildCities[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!!customeValues) {
      setQueries(customeValues);
    } else setQueries(queriesParams);
  }, [customeValues, queriesParams?.cities]);

  const { data: provinces, isLoading: provLoading } = useQuery({
    queryFn: () => CityService.GetAllCities({ is_parent: 1 }),
    queryKey: [CityService.GET_ALL_CITIES_CACHEKEY],
  });

  /* -------------------------------------------------------------------------- */
  /*                        GETTING SELECTED CITIES TITLS                       */
  /* -------------------------------------------------------------------------- */

  const { data: defaultCitiesData } = useQuery({
    queryFn: () => {
      if (!!queries?.cities) return CityService.GetAllCities({ cities: JSON.stringify(queries?.cities) });
      else return null;
    },
    queryKey: [CityService.GET_ALL_CITIES_CACHEKEY, queries?.cities],
  });

  /* -------------------------------------------------------------------------- */
  /*                             GETTING ALL CITIES                             */
  /* -------------------------------------------------------------------------- */

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryFn: () => {
      if (!!selectedProv?.id) return CityService.GetCities({ parentId: selectedProv?.id });
      else return [];
    },
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, selectedProv?.id],
  });

  useEffect(() => {
    if (!!defaultCitiesData) {
      setSelectedCities(defaultCitiesData);
      if (!!setTitle)
        setTitle(
          `جستجو در  ${defaultCitiesData?.[0]?.title} ${
            defaultCitiesData?.length > 1 ? ` و ${defaultCitiesData?.length - 1} شهر دیگر` : ``
          }`
        );
    } else {
      if (!!setTitle) setTitle("");
    }
  }, [defaultCitiesData, queries]);

  /////////////////

  const removeSelectedProve = () => {
    setSelectedProv(null);
    setSearch("");
  };

  //////////////////

  const onCityClick = (item: ChildCities) => {
    if (!!selectedCities?.find((e) => e?.id == item?.id)) {
      setSelectedCities(selectedCities?.filter((e) => e?.id != item?.id));
    } else {
      setSelectedCities((e) => [...e, item]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                            SETTING DEFAULT VALS                            */
  /* -------------------------------------------------------------------------- */

  const onSubmitClick = () => {
    if (!!onSubmitCustomeCB) {
      onSubmitCustomeCB((e: any) => ({ ...e, cities: selectedCities?.map((e) => e?.id) }));
    } else {
      const body = {
        ...queries,
      };
      body.cities = selectedCities?.map((e) => e?.id);

      if (!!passedUrl) {
        router.push(`${passedUrl}?${queryBuilder(body)}`);
      } else {
        router.replace(`${pathname}?${queryBuilder(body)}`);
      }
    }
    onHide();
  };

  return (
    <Modal
      zIndex={40000000}
      options={{
        containerClass:
          "mx-auto my-0 md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4  rounded-0 md:rounded-2xl overflow-y-scroll bg-white dark:bg-zinc-900  relative min-h-[100dvh]  min:min-h-[80dvh] ",
      }}
      onHide={onHide}
      show={!!show}
    >
      <CityModalHeaderPart selectedProv={selectedProv} onHide={onHide} removeSelectedProve={removeSelectedProve} />

      <div className=" w-full flex flex-col gap-4  mt-4 p-3  h-auto min-h-full">
        <CityModalSearchPart search={search} setSearch={setSearch} />

        <CityModalSelectedAccardiom selectedCities={selectedCities} onCityClick={onCityClick} />
        <p>{!selectedProv ? _STRINGS.PROV_LISTS : `${_STRINGS.CITY_LISTS} ${selectedProv?.title}`}</p>

        {/*  SELECT ALL CHECK */}
        {!!selectedProv ? (
          <CityModalAllCitiesButton
            cities={cities}
            setSelectedCities={setSelectedCities}
            selectedCities={selectedCities}
          />
        ) : (
          <></>
        )}

        {provLoading ? (
          <LottieLoading />
        ) : !selectedProv ? (
          isEmpty(provinces) ? (
            <EmptyList />
          ) : (
            provinces
              ?.filter((e) => e?.title.includes(search))
              ?.map((e) => (
                <ProvienceCard
                  callback={() => {
                    setSelectedProv(e);
                    setSearch("");
                  }}
                  item={e}
                  key={`prov${e?.id}${e?.title}`}
                />
              ))
          )
        ) : isEmpty(cities) ? (
          <EmptyList />
        ) : (
          cities
            ?.filter((e) => e?.title.includes(search))
            ?.map((e) => (
              <CityCard
                isChecked={selectedCities?.map((x) => x?.id)?.includes(e?.id)}
                callback={() => {
                  onCityClick(e);
                }}
                item={e}
                key={`cities${e?.title}`}
              />
            ))
        )}
      </div>

      <div className=" bg-white shadow-card w-full py-4 flex items-center sticky gap-4 px-[10%] bottom-0  ">
        {!!selectedProv ? (
          <Button
            onClick={removeSelectedProve}
            width="w-full "
            variant="outline"
            containerClass="flex w-full  items-center justify-center "
            title={_STRINGS.RETURN}
          />
        ) : (
          <></>
        )}
        <Button
          onClick={onSubmitClick}
          width="w-full "
          containerClass="flex w-full   items-center justify-center "
          title={item?.submitTitle || (!!onSubmitCustomeCB ? _STRINGS.SUBMIT : _STRINGS.SEARCH)}
        />
      </div>
    </Modal>
  );
};

export default CityModal;
