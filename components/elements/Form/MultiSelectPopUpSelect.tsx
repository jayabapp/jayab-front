
import type { MultiSelectProps } from "@/types/components/elements/form";
import React, { useState } from "react";

import ContentImage from "@elements/Image/ContentImage";
import _STRINGS from "@/utils/LocalStrings";
import PopUpDown from "@elements/PopUpDown";
import Selecti from "./MultiSelectSelecti";
import Button from "@elements/Button";

const MultyPopUpSelect = ({
  item,

  value,
  onSelect,
  closeOnSelect,
  title,
}: MultiSelectProps) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <div>
        <div
          className={` ${item?.disableHover ? "" : "hover:border-neutral-200 focus:border-neutral-200 "} w-full ${
            item?.disable ? "opacity-70" : ""
          }  !bg-neutral-400 flex flex-col items-start gap-2 placeholder:!opacity-50  placeholder:!text-black border-transparent text-start px-2 py-3 rounded-xl `}
        >
          <div className="flex items-center gap-2">
            <p>{title}</p>
            <button
              aria-label={_STRINGS.INCREASE}
              onClick={() => {
                if (!item?.disable) setShow(true);
              }}
              className=" w-6 h-6 aspect-square rounded-full border border-brand-600 flex items-center justify-center"
              disabled={item?.disable}
              type="button"
            >
              <ContentImage alt="" height={24} width={24} src="/assets/icons/adds/blue_plus.svg" className="w-2.5 h-2.5 aspect-square cursor-pointer " />
            </button>
          </div>

          <div className={`${value.length > 0 ? "opacity-100" : "opacity-50"} gap-2 w-full flex flex-wrap`}>
            {value.length > 0
              ? value.map((val) => (
                  <div
                    key={`selectedItems${val?.id || val}`}
                    className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-brand-600  bg-brand-600/5 text-brand-600  text-xs "
                  >
                    <p className="text-xs pr-2">{item?.list?.find((e) => e?.id == val)?.title || val?.title || ""} </p>
                    <button
                      aria-label={_STRINGS.CLOSE}
                      onClick={() => {
                        onSelect(val);
                      }}
                      className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600 flex items-center justify-center"
                      type="button"
                    >
                      <ContentImage alt="" height={24} width={24} src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
                    </button>
                  </div>
                ))
              : item?.placeholder}
          </div>
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
