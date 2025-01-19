import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import queryBuilder from "@/helpers/queryBuilder";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo } from "react";

const FiltersSelectedFiltersShowcase = ({
  query,
  propertyTypes,
}: {
  propertyTypes: {
    [key: string]: ProvienceTypesDto[];
  };

  query: any;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // const finalizzedKeys = Object.keys(propertyTypes)
  //   ?.filter((e) => !!query?.[e.toLowerCase()])
  //   ?.map((e) => e?.toLowerCase());
  // const valueObjects = finalizzedKeys?.map((e) =>
  //   query?.[e]?.split(",")?.map((x) => propertyTypes[e.toUpperCase()]?.find((z) => z?.id == x))
  // );

  const finallizedSelectedOptions = useMemo(() => {
    let data = [];
    if (!!propertyTypes && query) {
      let objectKeys = Object.keys(propertyTypes)?.map((e) => e?.toLowerCase());

      for (let index = 0; index < objectKeys.length; index++) {
        const element = objectKeys[index];
        if (!!query?.[element]) {
          console.log(query?.[element]?.split(","), "query?.[element]query?.[element]");
          data.push(
            query?.[element]?.split(",")?.map((x: any) => propertyTypes[element.toUpperCase()]?.find((z) => z?.id == x))
          );
        }
      }
    }
    return data;
  }, [propertyTypes, query]);

  const queryMaker = (items: any[], queryKey: string) => {
    let temp = { ...query };
    const body = {
      ...temp,
    };

    if (!!items) {
      body[queryKey] = items?.map((e) => e?.id);
    } else {
      delete body[queryKey];
    }

    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const onFilterClick = (i: any, queyData: any) => {
    let temp: any = [];

    if (queyData?.find((it: any) => it?.id == `${i?.id}`)) {
      temp = queyData?.filter((it: any) => it?.id != `${i?.id}`);
    }

    queryMaker(temp, i?.group.toLowerCase());
  };
  return (
    <div className="flex flex-wrap items-center w-full  pb-4 gap-2">
      {finallizedSelectedOptions?.map((oneRow) => {
        return oneRow?.map((e: any) => (
          <div
            key={`selectedItems${e?.id}`}
            className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs "
          >
            <p className="text-xs pr-2">{e?.title} </p>
            <div
              onClick={() => {
                onFilterClick(e, oneRow);
              }}
              className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </div>
        ));
      })}
    </div>
  );
};

export default FiltersSelectedFiltersShowcase;
