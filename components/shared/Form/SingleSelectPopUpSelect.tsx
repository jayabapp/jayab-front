import React, { useState } from "react";
// import PopUpDown from "../PopUpDown";
// import Selecti from "./SingleSelectSelecti";
import { isEmpty } from "lodash";
// import ModalBottomSheet from "../Modal/ModalBottomSheet";
import PopUpDown from "@/components/PopUpDown";
import Selecti from "./SingleSelectSelecti";
import _STRINGS from "@/utils/LocalStrings";

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

  return (
    <div className={`relative mt-4 inline-block w-full ${item?.containerClass}`}>
      <div className="flex flex-col">
        {item?.title ? (
          <p
            className={`text-sm opacity-90 pr-2 pb-3 ${
              item?.isMandatory && "after:content-['*'] after:mr-1 after:text-red-500"
            }  `}
          >
            {item?.title}
          </p>
        ) : (
          <></>
        )}

        <div
          className={` ${item?.disableHover ? "" : " "} w-full ${item?.disable ? "opacity-70" : ""} ${
            item?.inputClass
          }   dark:border-gray-600 bg-white/80   custome-shadow-card  flex items-center placeholder:!opacity-50  placeholder:!text-sm placeholder:!text-black  text-start px-2 py-3 rounded-10 `}
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
            color="#999999"
            className={`h-2 w-4 dark:invert  transition-all  ${show ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          {/* <img
            src={"/assets/icons/shared/chevron-down.svg"}
            className={`h-2 w-4 dark:invert  transition-all  ${show ? "rotate-180" : ""}`}
            aria-hidden="true"
          /> */}
        </div>
      </div>
      <PopUpDown setVisible={setShow} visible={show}>
        <div className="flex flex-col   px-6 py-4">
          <div className="w-full p-4 pt-0 flex items-center justify-center border-b border-primary-300">
            <p className="text-primary-700 font-bold">{item?.title}</p>
          </div>
          {isEmpty(item?.list) ? (
            <p className="w-full text-center mt-4"> {_STRINGS.NODATA_LIST}</p>
          ) : (
            item?.list?.map((item) => (
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
      </PopUpDown>
    </div>
  );
};

export default SinglePopUpSelect;
