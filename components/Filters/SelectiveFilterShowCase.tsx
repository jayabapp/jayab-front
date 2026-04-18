import { useModalVisible } from "@/hooks/modal.hook";
import ModalBottomSheet from "../Modal/ModalBottomSheet";
import ModalHeaderPart from "../Modal/ModalHeaderPart";
import ProductModels from "./ProductModelx";

const SelectiveFilterShowCase = ({
  title,
  list,
  queryKey,
  query,
}: {
  title: any;
  list: any[];
  queryKey?: any;
  query: any;
}) => {
  const { _onHide, _onShow, isVisible } = useModalVisible();

  const slectedCount = query?.[queryKey]?.split(",")?.length;
  return (
    <>
      <div
        onClick={_onShow}
        className="rounded-full !w-auto    cursor-pointer  gap-0   py-2 h-8 pl-2 pr-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs "
      >
        <p className="text-xs pr-2">{title} </p>
        {!!slectedCount ? <p className="text-sm font-medium pr-2"> : {slectedCount || ""} </p> : <></>}
      </div>
      <ModalBottomSheet show={isVisible} onHide={_onHide}>
        <ModalHeaderPart title={title} onHide={_onHide} />

        <div className=" flex p-4">
          <ProductModels list={list} queryKey={queryKey} isMulty query={query} />
        </div>
      </ModalBottomSheet>
    </>
  );
};

export default SelectiveFilterShowCase;
