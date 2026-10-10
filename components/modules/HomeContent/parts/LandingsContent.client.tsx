"use client";

import { useTranslations } from "next-intl";
import { HTMLGenerator } from "@/helpers/html.generator";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import { type Content } from "@/types/components/modules/home";


const LandingsContentSection = ({
  data,
  options,
}: {
  data: Content;
  options: { parentPadding?: string };
}) => {
  const t = useTranslations("content");

  const [isOpen, setIsOpen] = useState(false);
  const { html } = HTMLGenerator(data?.html || "", {
    hasHeading: true,
    hasCount: true,
  });

  const onOpenClick = () => {
    if (isOpen)
      document
        .getElementById(`content${data?.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen((e) => !e);
  };

  return (
    <div
      id={`content${data?.id}`}
      className={`flex w-full  scroll-mt-40  relative ${options?.parentPadding ?? "pt-12   padding-x  md:px-[15%]  2xl:px-[20%] "}  items-center justify-center flex-col gap-4`}
    >
      <div
        className={`${isOpen ? "is-opend" : " "} accardion-class rounded-b-md transition-all `}
      >
        <div
          className={`${isOpen ? "  min-h-[15rem] " : " h-[15rem] "}  transition-all  content leading-7   blogBody category_table   text-[0.8125rem] opacity-85  !text-justify `}
          dangerouslySetInnerHTML={{ __html: `${html}` }}
        />
      </div>
      <div
        className={` absolute  z-1 !rounded-b-10 md:!rounded-b-20 ${isOpen ? "-bottom-12" : "bottom-0"}  left-0 right-0 w-full py-8 md:py-8 bg-gradient-to-b from-surface/0 via-surface/80 to-surface/100 flex items-center justify-center`}
      >
        <div
          onClick={onOpenClick}
          className={` cursor-pointer flex items-center gap-2  transition-all`}
        >
          <p className="text-sm font-medium">
            {isOpen ? t("seeLess") : t("watchAll")}
          </p>
          <ContentImage
            alt=""
            width={16}
            height={16}
            src={"/assets/icons/shared/chevron-left.svg"}
            className={`  w-4 h-4 ${isOpen ? `rotate-[90deg]` : "-rotate-[90deg]"} transition-all `}
          />
        </div>
      </div>
    </div>
  );
};

export default LandingsContentSection;
