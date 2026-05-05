"use client";
import { ContentDto } from "@/api_services/home/home.interface";
import { HTMLGenerator } from "@/helpers/html.generator";
import _STRINGS from "@/utils/LocalStrings";
import { useState } from "react";

const HomeContentSection = ({ data }: { data: ContentDto }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { html, headings, timeToRead, wordCount } = HTMLGenerator(data?.html || "", {
    hasHeading: true,
    hasCount: true,
  });
  return (
    <div className="flex w-full pt-12 padding-x items-center justify-center flex-col gap-4">
      <p className="font-bold">{data?.small_text}</p>
      <div className={`  ${isOpen ? "is-opend    " : " "} accardion-class   rounded-b-md transition-all `}>
        <div
          className={`   ${isOpen ? "  min-h-12 " : "h-12"}  transition-all  content  !text-justify `}
          dangerouslySetInnerHTML={{ __html: `${html}` }}
        />
      </div>

      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className={` cursor-pointer flex items-center gap-2 ${isOpen ? "opacity-0" : ""}  transition-all`}
      >
        <p className="text-sm font-medium">{_STRINGS.WATCH_ALL}</p>
        <img className=" -rotate-[90deg] w-4 h-4 " src={"/assets/icons/shared/chevron-left.svg"} />
      </div>
    </div>
  );
};

export default HomeContentSection;
