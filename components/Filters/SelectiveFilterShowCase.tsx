import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { useModalVisible } from "@/hooks/modal.hook";
import _STRINGS from "@/utils/LocalStrings";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ModalBottomSheet from "../Modal/ModalBottomSheet";
import ModalHeaderPart from "../Modal/ModalHeaderPart";
import Button from "../shared/Button/Button";
import ProductModels from "./ProductModelx";

const SelectiveFilterShowCase = ({
  title,
  list,
  queryKey,
  query,
  removeFiltersKeys,
}: {
  title: any;
  list: any[];
  queryKey?: any;
  query: any;
  removeFiltersKeys: (array: string[]) => void;
}) => {
  const { _onHide, _onShow, isVisible } = useModalVisible();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [filters, setFilters] = useState({});
  const queriesParams = useQueryGet<any>();
  const slectedCount = queriesParams?.[queryKey]?.split(",")?.filter((e: any) => !!e)?.length;
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!!queriesParams) {
      setFilters(queriesParams);
    }
  }, [searchParams]);

  const queryMaker = (items: any) => {
    const body = {
      ...items,
    };
    delete body.categories;
    delete body.page;
    _onHide();

    replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <>
      <div
        onClick={_onShow}
        className={`rounded-full !w-auto   ${!!slectedCount ? "" : " grayscale opacity-70"}  transition-all  cursor-pointer  gap-0   py-1 h-[1.625rem] pl-2 pr-1 flex items-center justify-center border    border-brand-600  bg-brand-600/5 text-brand-600  text-xs `}
      >
        <p className="text-xs pr-2">{title} </p>
        {!!slectedCount ? (
          <>
            <p className="text-sm font-medium pr-2">
              {" "}
              {slectedCount || ""} <span className="text-xxs font-normal "> مورد</span>
            </p>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFiltersKeys([queryKey]);
              }}
              className=" cursor-pointer w-4 h-4  mr-2 aspect-square rounded-full border border-brand-600 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <ModalBottomSheet show={isVisible} onHide={_onHide}>
        <ModalHeaderPart showX title={title} onHide={_onHide} />

        <div className=" flex flex-col p-4 !pb-0">
          <ProductModels
            // onClickCb={() => {
            //   _onHide();
            // }}
            mobileFilters={filters}
            setMobileFilters={setFilters}
            list={list}
            queryKey={queryKey}
            isMulty
            query={queriesParams}
          />

          <Button
            onClick={() => {
              queryMaker(filters);
            }}
            title={_STRINGS.SUBMIT_DO}
            containerClass=" w-full "
            width=" w-full "
          />
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default SelectiveFilterShowCase;
