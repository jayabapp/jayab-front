import { useTranslations } from "next-intl";
import { useState } from "react";

import type { MultiSelectProps } from "@/types/components/elements/form";

import ContentImage from "@elements/Image/ContentImage";
import PopUpDown from "@elements/PopUpDown";
import Selecti from "./MultiSelectSelecti";
import Button from "@elements/Button";

const MultyPopUpSelect = ({
  item,
  title,
  value,
  onSelect,
  closeOnSelect,
}: MultiSelectProps) => {
  const t = useTranslations("common");

  const [show, setShow] = useState(false);

  return (
    <div className="relative inline-block w-full">
      <div>
        <div
          className={` ${item?.disableHover ? "" : "hover:border-line focus:border-line "} w-full ${
            item?.disable ? "opacity-70" : ""
          }  !bg-neutral-400 flex flex-col items-start gap-2 placeholder:!opacity-50  placeholder:!text-ink border-transparent text-start px-2 py-3 rounded-xl `}
        >
          <div className="flex items-center gap-2">
            <p>{title}</p>
            <button
              aria-label={t("increase")}
              onClick={() => {
                if (!item?.disable) setShow(true);
              }}
              className=" w-6 h-6 aspect-square rounded-full border border-action flex items-center justify-center"
              disabled={item?.disable}
              type="button"
            >
              <ContentImage
                alt=""
                height={24}
                width={24}
                src="/assets/icons/adds/blue_plus.svg"
                className="w-2.5 h-2.5 aspect-square cursor-pointer "
              />
            </button>
          </div>

          <div
            className={`${value.length > 0 ? "opacity-100" : "opacity-50"} gap-2 w-full flex flex-wrap`}
          >
            {value.length > 0
              ? value.map((val) => (
                  <div
                    key={`selectedItems${val?.id || val}`}
                    className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-action  bg-action/5 text-link  text-xs "
                  >
                    <p className="text-xs pr-2">
                      {item?.list?.find((e) => e?.id == val)?.title ||
                        val?.title ||
                        ""}
                    </p>
                    <button
                      type="button"
                      aria-label={t("close")}
                      onClick={() => onSelect(val)}
                      className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-action flex items-center justify-center"
                    >
                      <ContentImage
                        alt=""
                        width={24}
                        height={24}
                        src="/assets/icons/adds/blue_plus.svg"
                        className="w-2 h-2 rotate-45 aspect-square "
                      />
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
              value={value}
              item={listItem}
              setShow={setShow}
              key={listItem?.id}
              onSelect={onSelect}
              full_item={item?.full_item}
              closeOnSelect={closeOnSelect}
            />
          ))}
        </div>
        {!item?.disable ? (
          <Button
            width="w-full"
            title={t("submit")}
            onClick={() => setShow(false)}
            containerClass="w-full absolute bottom-0  flex items-center justify-center px-[10%] pb-6 "
          />
        ) : (
          <></>
        )}
      </PopUpDown>
    </div>
  );
};

export default MultyPopUpSelect;
