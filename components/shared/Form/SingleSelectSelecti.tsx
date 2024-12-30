import { isEmpty } from "lodash";
import React from "react";
import { ItemType } from "./SingleSelectPopUpSelect";
import Checkbox from "./Checkbox";

type SelectiType = {
  item: ItemType;
  value?: string | number;
  onSelect: (e: string | number) => void | null;
  closeOnSelect?: boolean;
  velueString?: string;
  setShow?: (e: boolean) => void | null;
};

const Selecti = ({ item, value, onSelect, closeOnSelect, setShow, velueString }: SelectiType) => {
  return (
    <div
      onClick={() => {
        if (value == item?.id && !closeOnSelect) {
          onSelect("");
        } else {
          if (velueString) {
            onSelect(item[velueString]);
          } else onSelect(item?.id);
        }

        if (closeOnSelect && setShow) {
          setShow(false);
        }
      }}
      className={` relative  flex w-full items-center gap-4 justify-center  border-t cursor-pointer border-gray-100 py-2 transition-all duration-700 ease-in-out`}
    >
      {closeOnSelect ? (
        <div className=" absolute right-0">
          {value == item?.id ? (
            <img src="/assets/icons/shared/green_check_icon.svg" className="w-4 h-4 aspect-square text-emerald-500" />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="transition-all duration-700 ease-in-out">
          <Checkbox
            isChecked={item?.id ? (value == item?.id ? true : false) : false}
            onSelect={() => {
              if (velueString) {
                onSelect(item[velueString]);
              } else {
                onSelect(item?.id);
              }
            }}
            rounded="rounded-md"
          />
        </div>
      )}
      <div className=" flex items-center gap-4">
        <p style={item?.hex ? { color: item?.hex } : {}}>{item?.title} </p>
      </div>
    </div>
  );
};

export default Selecti;
