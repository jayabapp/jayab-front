import { isEmpty } from "lodash";
import React from "react";
import { ItemType } from "./MultiSelectPopUpSelect";
import Checkbox from "./Checkbox";

type SelectiType = {
  item: ItemType;
  value: (number | string | null | any)[];
  onSelect: (e: number | string | null | any) => void | null;
  closeOnSelect?: boolean;
  setShow?: (e: boolean) => void | null;
  full_item?: boolean;
};

const Selecti = ({ item, value, onSelect, closeOnSelect, setShow, full_item }: SelectiType) => {
  return (
    <div
      onClick={() => {
        if (!!full_item) {
          onSelect(item);
        } else {
          onSelect(item?.id);
        }

        if (closeOnSelect && setShow) {
          setShow(false);
        }
      }}
      className={`  flex w-full items-center gap-4  border-t cursor-pointer border-gray-100 py-2 transition-all duration-700 ease-in-out`}
    >
      <div className="transition-all duration-700 ease-in-out">
        <Checkbox
          isChecked={item?.id ? (value?.find((val) => val == item?.id || val?.id == item?.id) ? true : false) : false}
          onSelect={() => {
            if (!!full_item) {
              onSelect(item);
            } else {
              onSelect(item?.id);
            }
          }}
          // customeFillImage="/assets/icons/products/tick-square.svg"
          rounded="rounded-md"
        />
        {/* <img
          className="transition-all duration-700 ease-in-out"
          src={
            value.find((val) => val.id == item.id)
              ? `/assets/icons/dashboard/settings/checkbox_true.svg`
              : `/assets/icons/dashboard/settings/checkbox_false.svg`
          }
        /> */}
      </div>
      <div className=" flex items-center gap-4">
        <p style={item?.hex ? { color: item?.hex } : {}}>{item?.title} </p>
      </div>
    </div>
  );
};

export default Selecti;
