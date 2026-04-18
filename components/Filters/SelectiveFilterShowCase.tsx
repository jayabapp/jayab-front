import { useModalVisible } from "@/hooks/modal.hook";
import ModalBottomSheet from "../Modal/ModalBottomSheet";
import ModalHeaderPart from "../Modal/ModalHeaderPart";
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

  const slectedCount = query?.[queryKey]?.split(",")?.length;
  return (
    <>
      <div
        onClick={_onShow}
        className={`rounded-full !w-auto   ${!!slectedCount ? "" : " grayscale opacity-70"}  transition-all  cursor-pointer  gap-0   py-1 h-7 pl-2 pr-1 flex items-center justify-center border    border-primary-700  bg-primary-700/5 text-primary-700  text-xs `}
      >
        <p className="text-xs pr-2">{title} </p>
        {!!slectedCount ? (
          <>
            <p className="text-sm font-medium pr-2"> : {slectedCount || ""} </p>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                removeFiltersKeys([queryKey]);
              }}
              className=" cursor-pointer w-4 h-4  mr-2 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <ModalBottomSheet show={isVisible} onHide={_onHide}>
        <ModalHeaderPart title={title} onHide={_onHide} />

        <div className=" flex p-4">
          <ProductModels
            onClickCb={() => {
              _onHide();
            }}
            list={list}
            queryKey={queryKey}
            isMulty
            query={query}
          />
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default SelectiveFilterShowCase;
