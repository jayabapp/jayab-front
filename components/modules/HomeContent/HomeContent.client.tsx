"use client";

import { useTranslations } from "next-intl";
import { HTMLGenerator } from "@/helpers/html.generator";
import { ContentImage } from "@elements/Image";
import { useState } from "react";

import { type ContentByKeyDto, type ContentDto } from "@/types/components/modules/home";


const HomeContentSection = ({
  data,
  options,
}: {
  data: ContentDto | ContentByKeyDto | null;
  options?: { parentPadding?: string };
}) => {
  const t = useTranslations("content");

  const [isOpen, setIsOpen] = useState(false);

  const { html } = HTMLGenerator(data?.html || "", {
    hasHeading: true,
    hasCount: true,
  });

  const onOpenClick = () => {
    if (isOpen) {
      document
        .getElementById(`content${data?.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsOpen((e) => !e);
  };

  return (
    <div
      id={`content${data?.id}`}
      className={`flex w-full scroll-mt-40  ${options?.parentPadding ?? "pt-12   padding-x  md:px-[15%]  2xl:px-[20%] "}  items-center justify-center flex-col gap-4`}
    >
      <h1 className="">{data?.small_text}</h1>
      <div
        className={`  ${isOpen ? "is-opend    " : " "} accardion-class   rounded-b-md transition-all `}
      >
        <div
          className={`   ${isOpen ? "  min-h-[3.65rem] " : " h-[3.65rem] "}  transition-all  content leading-7   blogBody category_table   text-[0.8125rem] opacity-85  !text-justify `}
          dangerouslySetInnerHTML={{ __html: `${html}` }}
        />
      </div>

      <div
        onClick={onOpenClick}
        className={` cursor-pointer flex items-center gap-2 transition-all`}
      >
        <p className="text-sm font-medium">
          {isOpen ? t("seeLess") : t("watchAll")}
        </p>
        <ContentImage
          alt=""
          width={16}
          height={16}
          src={"/assets/icons/shared/chevron-left.svg"}
          className={`  w-4 h-4 ${isOpen ? "rotate-[90deg]" : "-rotate-[90deg]"} transition-all `}
        />
      </div>
    </div>
  );
};

export default HomeContentSection;
