"use client";

import { Transition } from "@headlessui/react";
import DOMPurify from "isomorphic-dompurify";
import React, { useState, useEffect, ReactNode } from "react";
type props = {
  title: string;
  isOpenFirst?: boolean;
  children: ReactNode;
  titleIcon?: ReactNode;
  ExtraElement?: any[];
  item?: {
    parenClass?: string;
    headClass?: string;
    noBorder?: boolean;
    titleClass?: string;
    parentClass?: string;
    invertIconDark?: boolean;
  };
};

const SimpleAccordion = ({
  title,
  children,
  ExtraElement,
  item,
  isOpenFirst,
  titleIcon,
}: props) => {
  const [isOpen, setIsOpen] = useState(isOpenFirst || false);
  return (
    <div
      className={`${isOpen ? "" : ""}  h-fit ${
        item?.parenClass
      } transition-all duration-100 ease-in-out  overflow-clip  px-2 py-2.5 `}
    >
      <div
        className={` flex justify-between items-center gap-3  ${
          item?.headClass
        } ${item?.noBorder ? "" : "border"}    transition-all cursor-pointer ${
          isOpen ? "rounded-t-md border-b-0  pb-4 " : "rounded-md "
        }`}
        onClick={() => setIsOpen((e) => !e)}
      >
        <div className="flex items-center gap-4">
          {titleIcon ? <div>{titleIcon}</div> : <></>}{" "}
          <div
            className={`text-[12px] lg:text-sm line-clamp-2    text-justify ${item?.titleClass}`}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(title, { FORBID_ATTR: ["style"] }),
            }}
          />
        </div>

        <div className="flex items-center gap-4">
          {" "}
          {ExtraElement ? (
            <div>
              <p>تعداد کالا ها {ExtraElement?.length}</p>
            </div>
          ) : (
            <></>
          )}{" "}
          <img
            src="/assets/icons/shared/chevron.svg"
            className={` object-contain transition-all   w-4 aspect-square ${
              isOpen ? "rotate-180" : ""
            } ${item?.invertIconDark ? "dark:invert" : ""}`}
          />
        </div>
      </div>

      <div
        className={`${item?.parentClass}  ${
          isOpen ? "is-opend " : ""
        } accardion-class    ${
          item?.noBorder ? "opacity-100" : "opacity-0"
        }  rounded-b-md transition-all `}
      >
        <div className="text-justify  font-light text-sm  ">{children}</div>
      </div>
    </div>
  );
};

export default SimpleAccordion;
