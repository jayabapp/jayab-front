import { usePathname, useRouter } from "next/navigation";
import { Dispatch } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import Checkbox from "../shared/Form/Checkbox";
import isArray from "lodash/isArray";

type ProductModelsType = {
  query?: any;
  isMulty?: boolean;
  mobileFilters?: any;
  list: any[] | undefined;
  queryKey: number | string;
  onClickCb?: () => void | null;
  setMobileFilters?: Dispatch<any>;
};
const ProductModels = ({
  list,
  query,
  isMulty,
  queryKey,
  onClickCb,
  mobileFilters,
  setMobileFilters,
}: ProductModelsType) => {
  const router = useRouter();
  const pathname = usePathname();

  const queyData =
    !!mobileFilters && mobileFilters[queryKey]
      ? `${mobileFilters[queryKey]}`?.split(",")
      : query[queryKey]
        ? `${query[queryKey]}`?.split(",")
        : "";

  const queryMaker = (items: any[]) => {
    let temp = mobileFilters ? { ...mobileFilters } : { ...query };
    const body = {
      ...temp,

      [queryKey]: items,
    };
    if (queryKey == "parent_category") {
      delete body.specifications;
      delete body.categories;
    }
    if (temp[queryKey] == items) delete body[queryKey];
    delete body.page;
    if (!!setMobileFilters) setMobileFilters(body);
    else router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  const checkifSelected = (i: any) => {
    if (isMulty && queyData)
      return queyData?.some((it: string) => it == `${i?.id}`);
    else if (!!mobileFilters) return mobileFilters[queryKey] == i?.id;
    else if (query[queryKey] == i?.id) return true;
    else return false;
  };

  return (
    <div className="w-full  my-2">
      {list?.map((i) => (
        <div
          key={`BRAND${i?.id}`}
          className="flex items-center my-2 gap-2 cursor-pointer"
          onClick={() => {
            let temp: any = queyData;
            if (isArray(queyData) && isMulty) {
              if (queyData?.some((it: string) => it == `${i?.id}`))
                temp = queyData?.filter((it: string) => it != `${i?.id}`);
              else temp = [...queyData, `${i?.id}`];
            } else {
              if (queyData && isMulty) temp = [queyData, `${i?.id}`];
              else temp = `${i?.id}`;
            }
            queryMaker(temp);
            onClickCb?.();
          }}
        >
          <Checkbox
            onSelect={() => {}}
            containerClass="w-fit"
            isChecked={checkifSelected(i)}
            rounded={isMulty ? "rounded-md" : "rounded-full"}
          />
          <p className="dark:text-neutral-200 text-sm">{i?.title}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductModels;
