import React, { useState } from "react";
import Selecti from "./MultiSelectSelecti";
import _STRINGS from "../../../utils/LocalStrings";
import PopUpDown from "@/components/PopUpDown";
import Button from "../Button/Button";

export interface ItemType {
  id: number;
  title: string;
  hex?: string;
}

type MultyPopUpSelectType = {
  item?: { disableHover?: boolean; placeholder?: string; list: ItemType[]; disable?: boolean; full_item?: boolean };
  value: (number | string | null | any)[];
  closeOnSelect?: boolean;
  onSelect: (e: number | string | null | any) => void | null;
  title?: string;
};

const MultyPopUpSelect = ({
  item,

  value,
  onSelect,
  closeOnSelect,
  title,
}: MultyPopUpSelectType) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <div>
        <div
          className={` ${item?.disableHover ? "" : "hover:border-primary-200 focus:border-primary-200 "} w-full ${
            item?.disable ? "opacity-70" : ""
          }  !bg-gray-1000 flex flex-col items-start gap-2 placeholder:!opacity-50  placeholder:!text-black border-transparent text-start px-2 py-3 rounded-xl `}
        >
          <div className="flex items-center gap-2">
            <p>{title}</p>
            <div
              onClick={() => {
                if (!item?.disable) setShow(true);
              }}
              className=" w-6 h-6 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
            >
              <img src="/assets/icons/adds/blue_plus.svg" className="w-2.5 h-2.5 aspect-square cursor-pointer " />
            </div>
          </div>

          <div className={`${value.length > 0 ? "opacity-100" : "opacity-50"} gap-2 w-full flex flex-wrap`}>
            {value.length > 0
              ? value.map((val, index) => (
                  <div
                    key={`selectedItems${val?.id || val}`}
                    className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-primary-700  bg-primary-700/5 text-primary-700  text-xs "
                  >
                    <p className="text-xs pr-2">{item?.list?.find((e) => e?.id == val)?.title || val?.title || ""} </p>
                    <div
                      onClick={() => {
                        onSelect(val);
                      }}
                      className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700 flex items-center justify-center"
                    >
                      <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
                    </div>
                  </div>
                ))
              : item?.placeholder}
          </div>

          {/* <img src={"/assets/icons/chevron-down-thick.svg"} className="h-2 w-4 dark:invert" aria-hidden="true" /> */}
        </div>
      </div>
      <PopUpDown setVisible={setShow} visible={show}>
        <div className="flex flex-col   px-6  !pb-24 pt-4">
          {" "}
          {item?.list?.map((listItem) => (
            <Selecti
              key={listItem?.id}
              item={listItem}
              value={value}
              onSelect={onSelect}
              closeOnSelect={closeOnSelect}
              setShow={setShow}
              full_item={item?.full_item}
            />
          ))}
        </div>
        {!item?.disable ? (
          <Button
            onClick={() => {
              setShow(false);
            }}
            title={_STRINGS.SUBMIT}
            containerClass="w-full absolute bottom-0  flex items-center justify-center px-[10%] pb-6 "
            width="w-full "
          />
        ) : (
          <></>
        )}
      </PopUpDown>
    </div>
  );
};

export default MultyPopUpSelect;
