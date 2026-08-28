import { useState } from "react";
// import PopUpDown from "../PopUpDown";
// import Selecti from "./SingleSelectSelecti";
import isEmpty from "lodash/isEmpty";
// import ModalBottomSheet from "../Modal/ModalBottomSheet";
import ModalBottomSheet from "@/components/Modal/ModalBottomSheet";
import ModalHeaderPart from "@/components/Modal/ModalHeaderPart";
import { p2e } from "@/helpers/NumberConverter";
import _STRINGS from "@/utils/LocalStrings";
import Selecti from "./SingleSelectSelecti";

export interface ItemType {
  id: number | string;
  title: string;
  hex?: string;
  [key: string]: string | number | any;
}

type PopUpSelectType = {
  item?: {
    title?: string;
    disableHover?: boolean;
    placeholder?: string;
    list: ItemType[];
    disable?: boolean;
    isMandatory?: boolean;
    inputClass?: string;
    containerClass?: string;
    searcheable?: boolean;
  };
  value: string | number;
  closeOnSelect?: boolean;
  velueString?: string;
  onSelect: (e: string | number) => void | null;
};

const SinglePopUpSelect = ({
  item,

  value,
  onSelect,
  closeOnSelect,
  velueString,
}: PopUpSelectType) => {
  const [show, setShow] = useState(false);

  const [search, setSearch] = useState("");
  return (
    <div className={`relative  inline-block w-full ${item?.containerClass} ${item?.disable ? "opacity-60" : ""} `}>
      <div className="flex flex-col">
        {item?.title ? (
          <p className={`text-sm opacity-90 pr-2 pb-3 ${item?.isMandatory && "after:content-['*'] after:mr-1 "}  `}>
            {item?.title}
          </p>
        ) : (
          <></>
        )}

        <div
          className={` ${item?.disableHover ? "" : " "} w-full  ${
            item?.inputClass
          }   bg-white/80   border  flex items-center placeholder:!opacity-50  placeholder:!text-sm placeholder:!text-black  text-start px-2 py-3 rounded-10 `}
          onClick={() => {
            if (!item?.disable) setShow(true);
          }}
        >
          <div className={`${value ? "opacity-100" : "opacity-50"} w-full truncate`}>
            {value
              ? `${
                  item?.list?.find((e) => {
                    if (velueString) {
                      return e?.[velueString] == value;
                    } else return e?.id == value;
                  })?.title
                }`
              : item?.placeholder || item?.title}
          </div>
          <img
            src="/assets/icons/shared/chevron.svg"
            className={`h-4 w-4   transition-all  ${show ? "rotate-180" : ""}`}
            // aria-hidden="true"
          />
          {/* <img
            src={"/assets/icons/shared/chevron-down.svg"}
            className={`h-2 w-4   transition-all  ${show ? "rotate-180" : ""}`}
            aria-hidden="true"
          /> */}
        </div>
      </div>
      <ModalBottomSheet
        options={{
          containerClass: `  ${
            item?.searcheable ? " min-h-[90dvh]" : ""
          } mx-auto rounded-t-20 !h-[90dvh] md:!h-auto  max-h-[90dvh] absolute pb-[1.5rem] md:pb-10 bottom-0 md:translate-x-1/2 md:right-1/2 w-full md:w-[calc(50svw)]  overflow-y-scroll bg-white `,
        }}
        onHide={() => {
          setShow(false);
        }}
        show={show}
      >
        <ModalHeaderPart
          hideArrow
          showX
          titleClass="text-brand-600"
          title={item?.title || item?.placeholder || ""}
          onHide={() => {
            setShow(false);
          }}
        />
        <div className="flex flex-col   px-6 py-4">
          {item?.searcheable ? (
            <div className="form-control !py-1.5 mb-2 !text-sm top-14  transition-all sticky z-2  rounded-10   !bg-neutral-100 ">
              <input
                value={search}
                placeholder={`جستجوی ${item?.title}`}
                onChange={(e) => setSearch(e.target.value)}
                className={` !text-base !bg-neutral-100   w-5/6 focus:border-brand-600 py-1 `}
              />
            </div>
          ) : (
            <></>
          )}
          {/* <div className="w-full p-4 pt-0 flex items-center justify-center border-b border-neutral-50">
            <p className="">{item?.title}</p>
          </div> */}
          {isEmpty(item?.list) ? (
            <p className="w-full text-center mt-4"> {_STRINGS.NODATA_LIST}</p>
          ) : (
            item?.list
              ?.filter((item) => item?.title?.toLocaleLowerCase().includes(p2e(search).toLowerCase()))
              ?.map((item) => (
                <Selecti
                  velueString={velueString}
                  key={item?.id}
                  item={item}
                  value={value}
                  onSelect={onSelect}
                  closeOnSelect={closeOnSelect}
                  setShow={setShow}
                />
              ))
          )}
        </div>
      </ModalBottomSheet>
    </div>
  );
};

export default SinglePopUpSelect;
