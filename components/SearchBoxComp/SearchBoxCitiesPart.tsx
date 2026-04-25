"use client";

import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { useCitiesStore } from "@/store";
import { isArray, isEmpty } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import SearchBoxCitiesPartCarts from "./SearchBoxCitiesPartCarts";

/* -------------------------------------------------------------------------- */
/*                                 CITIES PART                                */
/* -------------------------------------------------------------------------- */

const SearchBoxCitiesPart = ({ setShowPop }: { setShowPop: Dispatch<SetStateAction<boolean>> }) => {
  const { locationsData } = useCitiesStore();
  const queriesParams = useQueryGet<any>();
  const pathname = usePathname();
  const router = useRouter();

  const queyProvincesData = queriesParams["provinces"] ? `${queriesParams["provinces"]}`?.split(",") : "";
  const queyCityData = queriesParams["cities"] ? `${queriesParams["cities"]}`?.split(",") : "";
  const queyRegionsData = queriesParams["regions"] ? `${queriesParams["regions"]}`?.split(",") : "";

  const queryMaker = (items: any[], queryKey: string) => {
    let temp = !!queriesParams ? { ...queriesParams } : {};
    const body = {
      ...temp,

      [queryKey]: items,
    };
    if (isEmpty(items)) {
      delete body[queryKey];
    }
    delete body.page;
    if (queryKey == "cities" || queryKey == "provinces") {
      delete body.regions;
    }
    setShowPop(false);
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };
  ///////////////////////////
  const onClickCity = (i: any) => {
    let temp: any = queyCityData || [];
    if (isArray(queyCityData)) {
      if (queyCityData?.some((it: string) => it == `${i?.id}`)) {
        temp = queyCityData?.filter((it: string) => it != `${i?.id}`);
      } else {
        temp = [...queyCityData, `${i?.id}`];
      }
    }
    const newStoredCities = temp?.map((e: any) => locationsData?.cities?.find((x: any) => x?.id == e));

    useCitiesStore.setState({
      locationsData: {
        cities: newStoredCities,
        provinces: locationsData?.provinces,
      },
    });
    queryMaker(temp, "cities");
  };
  ////////////////////////////////
  const onClickRegion = (i: any) => {
    let temp: any = queyRegionsData || [];
    if (isArray(queyRegionsData)) {
      if (queyRegionsData?.some((it: string) => it == `${i?.id}`)) {
        temp = queyRegionsData?.filter((it: string) => it != `${i?.id}`);
      } else {
        temp = [...queyRegionsData, `${i?.id}`];
      }
    }
    const newStoredRegions = temp?.map((e: any) => locationsData?.regions?.find((x: any) => x?.id == e));

    useCitiesStore.setState({
      locationsData: {
        cities: locationsData?.cities,
        provinces: locationsData?.provinces,
        regions: newStoredRegions,
      },
    });
    queryMaker(temp, "regions");
  };
  ////////////////////////////////
  const onProvinceCity = (p: any) => {
    let temp: any = queyProvincesData || [];
    if (isArray(queyProvincesData)) {
      if (queyProvincesData?.some((it: string) => it == `${p?.id}`)) {
        temp = queyProvincesData?.filter((it: string) => it != `${p?.id}`);
      } else {
        temp = [...queyProvincesData, `${p?.id}`];
      }
    }
    const newStoredProvinces = temp?.map((e: any) => locationsData?.provinces?.find((x: any) => x?.id == e));

    useCitiesStore.setState({
      locationsData: {
        cities: locationsData?.cities,
        provinces: newStoredProvinces,
      },
    });

    queryMaker(temp, "provinces");
  };

  return (
    <div className="w-full p-4  flex flex-col gap-2 ">
      <p>شهرهای انتخاب شده</p>
      <div className="w-full flex flex-wrap gap-2 ">
        {" "}
        {locationsData?.provinces?.map((e: any) => (
          <SearchBoxCitiesPartCarts
            province
            item={e}
            key={`${e?.id}provSearch`}
            cb={() => {
              onProvinceCity(e);
            }}
          />
        ))}
        {locationsData?.cities?.map((e: any) => (
          <SearchBoxCitiesPartCarts
            item={e}
            key={`${e?.id}citySearch`}
            cb={() => {
              onClickCity(e);
            }}
          />
        ))}
        {locationsData?.regions?.map((e: any) => (
          <SearchBoxCitiesPartCarts
            item={e}
            key={`${e?.id}regionSearch`}
            cb={() => {
              onClickRegion(e);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchBoxCitiesPart;
