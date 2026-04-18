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

  const queyCityData = queriesParams["cities"] ? `${queriesParams["cities"]}`?.split(",") : "";

  const queryMaker = (items: any[], queryKey: string) => {
    let temp = { ...queriesParams };
    const body = {
      ...temp,

      [queryKey]: items,
    };
    if (isEmpty(items)) {
      delete body[queryKey];
    }
    delete body.page;
    delete body.regions;

    setShowPop(false);
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const onClickCity = (i: any) => {
    let temp: any = queyCityData;
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
        province: locationsData?.province,
      },
    });
    queryMaker(temp, "cities");
  };
  const onProvinceCity = () => {
    useCitiesStore.setState({
      locationsData: {
        cities: locationsData?.cities,
        province: [],
      },
    });
    queryMaker([], "province_id");
  };
  return (
    <div className="w-full p-4 flex flex-col gap-1">
      {locationsData?.province?.map((e: any) => (
        <SearchBoxCitiesPartCarts
          province
          item={e}
          key={`${e?.id}provSearch`}
          cb={() => {
            onProvinceCity();
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
    </div>
  );
};

export default SearchBoxCitiesPart;
