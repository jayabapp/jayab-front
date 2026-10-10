import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { p2e } from "@/helpers/NumberConverter";

import type { SingleSelectProps } from "@/types/components/elements/form";

import ContentImage from "@elements/Image/ContentImage";
import Selecti from "./SingleSelectSelecti";
import isEmpty from "lodash/isEmpty";

const SinglePopUpSelect = ({
  item,
  value,
  onSelect,
  velueString,
  closeOnSelect,
}: SingleSelectProps) => {
  const t = useTranslations("common");

  const [show, setShow] = useState(false);

  const [search, setSearch] = useState("");
  return (
    <div
      className={`relative  inline-block w-full ${item?.containerClass} ${item?.disable ? "opacity-60" : ""} `}
    >
      <div className="flex flex-col">
        {item?.title ? (
          <p
            className={`text-sm opacity-90 pr-2 pb-3 ${item?.isMandatory && "after:content-['*'] after:mr-1 "}  `}
          >
            {item?.title}
          </p>
        ) : (
          <></>
        )}

        <button
          aria-expanded={show}
          aria-haspopup="dialog"
          className={` ${item?.disableHover ? "" : " "} w-full  ${
            item?.inputClass
          }   bg-white/80   border  flex items-center placeholder:!opacity-50  placeholder:!text-sm placeholder:!text-black  text-start px-2 py-3 rounded-10 `}
          onClick={() => {
            if (!item?.disable) setShow(true);
          }}
          disabled={item?.disable}
          type="button"
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
          <ContentImage
            alt=""
            width={24}
            height={24}
            src="/assets/icons/shared/chevron.svg"
            className={`h-4 w-4 transition-all ${show ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <ModalBottomSheet
        options={{
          containerClass: `  ${
            item?.searcheable ? " min-h-[90dvh]" : ""
          } !h-[90dvh] max-h-[90dvh] w-full overflow-y-scroll rounded-t-20 bg-white pb-[1.5rem] md:!h-auto md:w-[32rem] md:max-w-[calc(100vw-2rem)] md:rounded-20 md:pb-10 `,
        }}
        onHide={() => setShow(false)}
        show={show}
      >
        <ModalHeaderPart
          showX
          hideArrow
          titleClass="text-brand-600"
          onHide={() => setShow(false)}
          title={item?.title || item?.placeholder || ""}
        />
        <div className="flex flex-col   px-6 py-4">
          {item?.searcheable ? (
            <div className="form-control !py-1.5 mb-2 !text-sm top-14  transition-all sticky z-2  rounded-10   !bg-neutral-100 ">
              <input
                value={search}
                placeholder={`${t("searchOf")} ${item?.title}`}
                onChange={(e) => setSearch(e.target.value)}
                className={` !text-base !bg-neutral-100   w-5/6 focus:border-brand-600 py-1 `}
              />
            </div>
          ) : (
            <></>
          )}
          {isEmpty(item?.list) ? (
            <p className="w-full text-center mt-4"> {t("nodataList")}</p>
          ) : (
            item?.list
              ?.filter((item) =>
                item?.title
                  ?.toLocaleLowerCase()
                  .includes(p2e(search).toLowerCase()),
              )
              ?.map((item) => (
                <Selecti
                  item={item}
                  value={value}
                  key={item?.id}
                  setShow={setShow}
                  onSelect={onSelect}
                  velueString={velueString}
                  closeOnSelect={closeOnSelect}
                />
              ))
          )}
        </div>
      </ModalBottomSheet>
    </div>
  );
};

export default SinglePopUpSelect;
