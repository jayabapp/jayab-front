"use client";

import type { SimpleAccordionProps } from "@/types/components/elements/accordion";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import DOMPurify from "isomorphic-dompurify";
const SimpleAccordion = ({
  item,
  title,
  children,
  titleIcon,
  isOpenFirst,
  ExtraElement,
}: SimpleAccordionProps) => {
  const [isOpen, setIsOpen] = useState(isOpenFirst || false);
  return (
    <div
      className={`${isOpen ? "" : ""}  h-fit ${
        item?.parenClass
      } transition-all duration-100 ease-in-out  overflow-clip  px-4 py-3 `}
    >
      <div
        className={` flex justify-between items-center gap-3  ${item?.headClass}    transition-all cursor-pointer ${
          isOpen
            ? ` ${item?.disableBorderB ? "" : "border-b"}   pb-2 `
            : "rounded-md "
        }`}
        onClick={() => setIsOpen((e) => !e)}
      >
        <div className="flex items-center gap-4">
          {titleIcon ? <div>{titleIcon}</div> : <></>}{" "}
          <div
            className={`text-sm lg:text-base font-medium line-clamp-2  content  text-justify ${item?.titleClass}`}
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
          <ContentImage
            alt=""
            width={16}
            height={16}
            src="/assets/icons/shared/chevron.svg"
            className={` object-contain transition-all   w-4 aspect-square ${isOpen ? "rotate-180" : ""} ${
              item?.invertIconDark ? "" : ""
            }`}
          />
        </div>
      </div>

      <div
        className={`${item?.parentClass}  ${
          isOpen ? "is-opend  pt-2 " : ""
        } accardion-class   rounded-b-md transition-all `}
      >
        <div className="text-justify   text-sm  ">{children}</div>
      </div>
    </div>
  );
};

export default SimpleAccordion;
