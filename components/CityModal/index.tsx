import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { NewCitiesListDto } from "@/api_services/city/city.interface";
import { useCitiesStore } from "@/store";
import { ChildCities } from "@/api_services/city/city.interface";
import { CityService } from "@/api_services/city/city.service";
import { useQuery } from "@tanstack/react-query";

import CityModalAllCitiesButton from "./CityModalAllCitiesButton";
import CityModalSelectedSwiper from "./CityModalSelectedSwiper";
import CityModalHeaderPart from "./CityModalHeaderPart";
import CityModalSearchPart from "./CityModalSearchPart";
import LottieLoading from "../shared/Lotties/LottieLoading";
import ProvienceCard from "./ProvienceCard";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import EmptyList from "../shared/Lotties/EmptyList";
import _STRINGS from "@/utils/LocalStrings";
import CityCard from "./CityCard";
import isEmpty from "lodash/isEmpty";
import Button from "../shared/Button/Button";
import Modal from "../Modal";

type TCityModal = {
  show: boolean;
  isHome?: boolean;
  passedUrl?: string;
  customeValues?: any;
  onHide: () => void | null;
  item?: { submitTitle?: string };
  setTitle?: (e: string) => void | null;
  onSubmitExtendedCB?: () => void | null;
  onSubmitCustomeCB?: (e: any) => void | null;
  setRegionsCb?: (e: ChildCities | null) => void | null;
};

const CityModal = ({
  show,
  item,
  onHide,
  isHome,
  setTitle,
  passedUrl,
  setRegionsCb,
  customeValues,
  onSubmitCustomeCB,
  onSubmitExtendedCB,
}: TCityModal) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queriesParams = useQueryGet<any>();
  const [queries, setQueries] = useState<{ [key: string]: any }>({});
  const [selectedProv, setSelectedProv] = useState<NewCitiesListDto | null>(
    null,
  );
  const [selectedCities, setSelectedCities] = useState<ChildCities[]>([]);
  const [defaultProvienceCities, setDefaultProvienceCities] = useState<
    ChildCities[]
  >([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!!customeValues) setQueries(customeValues);
    else setQueries(queriesParams);
  }, [customeValues, searchParams]);

  const { data: provinces, isLoading: provLoading } = useQuery({
    queryFn: () => CityService.GetAllCities({ is_parent: 1 }),
    queryKey: [CityService.GET_ALL_CITIES_CACHEKEY],
  });

  const { data: defaultCitiesData } = useQuery({
    queryFn: () => {
      if (!!queries?.cities)
        return CityService.GetAllCities({
          cities: JSON.stringify(queries?.cities),
        });
      else return null;
    },
    queryKey: [CityService.GET_ALL_CITIES_CACHEKEY, queries?.cities],
  });

  useEffect(() => {
    if (!isEmpty(provinces) && queries?.provinces) {
      const queryProvincesIds = queries?.provinces?.split(",");
      const ProvincesCities = provinces
        ?.filter((e) => queryProvincesIds?.includes(`${e?.id}`))
        ?.flatMap((e) => e?.child);
      setDefaultProvienceCities(ProvincesCities || []);
    } else {
      setDefaultProvienceCities([]);
    }
  }, [provinces, queries?.provinces]);

  const { data: cities } = useQuery({
    queryFn: () => {
      if (!!selectedProv?.id)
        return CityService.GetCities({ parentId: selectedProv?.id });
      else return [];
    },
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, selectedProv?.id],
  });

  useEffect(() => {
    if (
      !!defaultCitiesData ||
      (!!defaultProvienceCities && !isEmpty(defaultProvienceCities))
    ) {
      const allDefaultCities = !!defaultCitiesData
        ? [...defaultCitiesData, ...defaultProvienceCities]
        : defaultProvienceCities;
      setSelectedCities(allDefaultCities);
      if (!!setRegionsCb) {
        if (
          allDefaultCities?.length == 1 &&
          !isEmpty(allDefaultCities?.[0]?.child)
        )
          setRegionsCb(allDefaultCities?.[0]);
        else setRegionsCb(null);
      }
      if (!!setTitle) {
        const queryProvincesIds = queries?.provinces
          ?.split(",")
          ?.map((e: string) => Number(e));
        const selectedProvs = provinces?.filter((e) =>
          queryProvincesIds?.includes(e?.id),
        );

        setTitle(
          `${
            selectedProvs?.length == 1 && isEmpty(defaultCitiesData)
              ? `استان ${selectedProvs?.[0]?.title}`
              : defaultCitiesData?.length == 1 && isEmpty(selectedProvs)
                ? defaultCitiesData?.[0]?.title
                : !isEmpty(selectedProvs) || !isEmpty(defaultCitiesData)
                  ? `${(defaultCitiesData?.length || 0) + (selectedProvs?.length || 0)} ${_STRINGS.CITY}`
                  : ""
          } `,
        );
      }
    } else {
      setSelectedCities([]);
      if (!!setTitle) setTitle("");
    }
  }, [defaultCitiesData, JSON.stringify(queries), defaultProvienceCities]);
  const removeSelectedProve = () => {
    setSelectedProv(null);
    setSearch("");
  };
  const onCityClick = (item: ChildCities) => {
    if (!!selectedCities?.find((e) => e?.id == item?.id))
      setSelectedCities(selectedCities?.filter((e) => e?.id != item?.id));
    else setSelectedCities((e) => [...e, item]);
  };

  const onProvCancelClick = (item: NewCitiesListDto) => {
    setSelectedCities(
      selectedCities?.filter((e) => !item?.child?.some((x) => x?.id == e?.id)),
    );
  };

  const onSubmitClick = () => {
    if (!!onSubmitCustomeCB) {
      onSubmitExtendedCB?.();
      onSubmitCustomeCB((e: any) => ({
        ...e,
        cities: selectedCities?.map((e) => e?.id),
      }));
    } else {
      const body = {
        ...queries,
      };

      let fullSelectedcities = [];
      let selectedProv = [];
      const provincesHelper = provinces || [];
      const copiedProvs = JSON.parse(JSON.stringify([...provincesHelper]));

      const allIncludedProves = copiedProvs
        ?.filter((e: any) =>
          e?.child?.some((f: any) =>
            selectedCities?.some((x) => x?.id == f?.id),
          ),
        )
        ?.map((e: any) => ({
          ...e,
          child: e?.child?.filter((f: any) =>
            selectedCities?.some((x) => x?.id == f?.id),
          ),
        }));

      const allFullProviencesSelected = allIncludedProves?.filter(
        (e: NewCitiesListDto) => {
          const selectedMainProv = provinces?.find((x) => x?.id == e?.id);
          return selectedMainProv?.child?.length == e?.child?.length;
        },
      );

      fullSelectedcities = selectedCities;

      if (allFullProviencesSelected?.length > 0) {
        selectedProv = allFullProviencesSelected;
        const citiesWhithoutProv = allIncludedProves
          ?.filter(
            (x: NewCitiesListDto) =>
              !allFullProviencesSelected
                ?.map((p: any) => p?.id)
                .includes(x?.id),
          )
          ?.flatMap((e: NewCitiesListDto) => e?.child);

        body.cities = citiesWhithoutProv?.map((e: NewCitiesListDto) => e?.id);
        fullSelectedcities = citiesWhithoutProv?.map(
          (e: NewCitiesListDto) => e,
        );
        body.provinces = allFullProviencesSelected?.map((e: any) => e?.id);
      } else {
        body.cities = selectedCities?.map((e) => e?.id);
        delete body.provinces;
      }
      delete body.page;
      delete body.regions;
      useCitiesStore.setState({
        locationsData: {
          cities: fullSelectedcities,
          provinces: selectedProv,
        },
      });

      if (!!passedUrl) {
        if (!!isHome && !body?.provinces && isEmpty(body?.cities)) {
        } else {
          router.push(`${passedUrl}?${queryBuilder(body)}`);
        }
      } else {
        router.replace(`${pathname}?${queryBuilder(body)}`);
      }
    }
    onSubmitExtendedCB?.();
    onHide();
  };

  const provienceAndCitiesSearchEngine = (
    e: NewCitiesListDto | ProvienceTypesDto,
  ) => {
    let foundOne = false;
    if (e?.title.includes(search)) foundOne = true;
    else if (!!e?.child?.find((x) => x?.title == search)) foundOne = true;
    return foundOne;
  };

  const clearSelected = () => {
    setSelectedProv(null);
    setSelectedCities([]);
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
      <CityModalHeaderPart
        onHide={onHide}
        selectedProv={selectedProv}
        removeSelectedProve={removeSelectedProve}
      />

      <div className=" w-full flex flex-col gap-4  mt-4 p-3  h-auto min-h-full">
        <CityModalSearchPart search={search} setSearch={setSearch} />

        <CityModalSelectedSwiper
          provinces={provinces}
          onCityClick={onCityClick}
          clearSelected={clearSelected}
          selectedCities={selectedCities}
          onProvCancelClick={onProvCancelClick}
        />
        <p>
          {!selectedProv
            ? _STRINGS.PROV_LISTS
            : `${_STRINGS.CITY_LISTS} ${selectedProv?.title}`}
        </p>

        {/*  SELECT ALL CHECK */}
        {!!selectedProv ? (
          <CityModalAllCitiesButton
            cities={cities}
            selectedCities={selectedCities}
            setSelectedCities={setSelectedCities}
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
              ?.filter((e) => provienceAndCitiesSearchEngine(e))
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
            ?.filter((e) => provienceAndCitiesSearchEngine(e))
            ?.map((e, i) => (
              <CityCard
                isChecked={selectedCities?.map((x) => x?.id)?.includes(e?.id)}
                callback={() => {
                  onCityClick(e);
                }}
                item={e}
                key={`cities${e?.title}${e?.id || i}`}
              />
            ))
        )}
      </div>

      {!!selectedProv ? (
        <div className=" bg-white shadow-card w-full py-4 flex items-center sticky gap-4 px-[10%] bottom-0  ">
          <Button
            key={"s1"}
            width="w-full "
            variant="outline"
            title={_STRINGS.RETURN}
            onClick={removeSelectedProve}
            containerClass="flex w-full  items-center justify-center "
          />
          <Button
            key={"s2"}
            width="w-full "
            onClick={onSubmitClick}
            containerClass="flex w-full   items-center justify-center "
            title={
              item?.submitTitle ||
              (!!onSubmitCustomeCB ? _STRINGS.SUBMIT : _STRINGS.SEARCH)
            }
          />
        </div>
      ) : (
        <div className=" bg-white shadow-card w-full py-4 flex items-center sticky gap-4 px-[10%] bottom-0  ">
          <Button
            key={"s4235"}
            onClick={onSubmitClick}
            width="w-full "
            containerClass="flex w-full   items-center justify-center "
            title={
              item?.submitTitle ||
              (!!onSubmitCustomeCB ? _STRINGS.SUBMIT : _STRINGS.SEARCH)
            }
          />
        </div>
      )}
    </Modal>
  );
};

export default CityModal;
