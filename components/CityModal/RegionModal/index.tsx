import { ChildCities } from "@/api_services/city/city.interface";
import Modal from "@elements/Modal";
import { ModalHeaderPart } from "@elements/Modal";
import Button from "@elements/Button";
import EmptyState from "@elements/EmptyState";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CityCard from "../CityCard";
import CityModalSearchPart from "../CityModalSearchPart";
import SelectedRegions from "./SelectedRegions";

const RegionModal = ({
  show,
  onHide,
  passedUrl,
  setRegionsCb,
  cityWithRegions,
}: {
  show: boolean;
  onHide: () => void | null;
  passedUrl?: string;
  setRegionsCb?: (e: ChildCities) => void | null;
  cityWithRegions: ChildCities | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const queriesParams = useQueryGet<any>();
  const [queries, setQueries] = useState<{ [key: string]: any }>({});
  const [selectedRegions, setSelectedregions] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setQueries(queriesParams);
  }, [queriesParams?.regions, queriesParams?.cities, queriesParams?.provinces]);

  useEffect(() => {
    if (!!queriesParams?.regions && !isEmpty(cityWithRegions?.child)) {
      setSelectedregions(
        queriesParams?.regions
          ?.split(",")
          ?.map((e: string | number) => cityWithRegions?.child?.find((x) => x?.id == e))
          ?.filter((f: any) => !!f),
      );
    } else {
      setSelectedregions([]);
    }
  }, [queriesParams?.regions, cityWithRegions]);

  /* -------------------------------------------------------------------------- */
  /*                        GETTING SELECTED CITIES TITLS                       */
  /* -------------------------------------------------------------------------- */

  //////////////////

  const onRegionClick = (item: ChildCities) => {
    if (!!selectedRegions?.find((e) => e?.id == item?.id)) {
      setSelectedregions(selectedRegions?.filter((e) => e?.id != item?.id));
    } else {
      setSelectedregions((e) => [...e, item]);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                            SETTING DEFAULT VALS                            */
  /* -------------------------------------------------------------------------- */

  const onSubmitClick = () => {
    const body = {
      ...queries,
    };

    if (selectedRegions) {
      body.regions = selectedRegions?.map((e) => e?.id);
    }
    delete body.page;
    if (!!passedUrl) {
      router.push(`${passedUrl}?${queryBuilder(body)}`);
    } else {
      router.replace(`${pathname}?${queryBuilder(body)}`);
    }
    onHide();
  };

  const onRegionSearchFunc = (e: ChildCities) => {
    let foundOne = false;
    if (e?.title.includes(search)) {
      foundOne = true;
    } else if (!!e?.child?.find((x) => x?.title?.includes(search))) {
      foundOne = true;
    }
    return foundOne;
  };

  return (
    <Modal
      zIndex={40000000}
      options={{
        containerClass:
          "mx-auto my-0 md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4  rounded-0 md:rounded-2xl overflow-y-scroll bg-white   relative min-h-[100dvh]  min:min-h-[80dvh] ",
      }}
      onHide={onHide}
      show={!!show}
    >
      <ModalHeaderPart showX onHide={onHide} title={_STRINGS.LOCAL} />

      <div className=" w-full flex flex-col gap-4  mt-4 p-3  h-auto min-h-full">
        <CityModalSearchPart options={{ placeholder: _STRINGS.SEARCH_REGION }} search={search} setSearch={setSearch} />

        <SelectedRegions selectedRegions={selectedRegions} onRegionClick={onRegionClick} />

        {isEmpty(cityWithRegions?.child) ? (
          <EmptyState />
        ) : (
          cityWithRegions?.child
            ?.filter((e) => onRegionSearchFunc(e))
            ?.map((e, i) => (
              <CityCard
                isChecked={selectedRegions?.map((x) => x?.id)?.includes(e?.id)}
                callback={() => {
                  onRegionClick(e);
                }}
                item={e}
                key={`cities${e?.title}${e?.id || i}`}
              />
            ))
        )}
      </div>

      <div className=" bg-white shadow-card w-full py-4 flex items-center sticky gap-4 px-[10%] bottom-0  ">
        <Button
          onClick={onSubmitClick}
          width="w-full "
          containerClass="flex w-full   items-center justify-center "
          title={_STRINGS.SUBMIT}
        />
      </div>
    </Modal>
  );
};

export default RegionModal;
