"use client";

import React, { useMemo, useState } from "react";
import _STRINGS from "@/utils/LocalStrings";
import SimpleAccordion from "@/components/shared/SimpleAccorion";

import { useQuery } from "@tanstack/react-query";
import { HomeService } from "@/api_services/home/home.service";
import Editable from "@/components/Editable";
import { chunkArray } from "@/helpers/chunk-array.helper";
import Breadcrumbs from "@/components/BreadCrumbs";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";

const RepetitiveQuestions = () => {
  const { data: faqData, isLoading: faqLoading } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, "faq"],
    queryFn: () =>
      HomeService?.GetContent({
        key: "faq",
        page: 1,
      }),
    staleTime: 0,
    gcTime: 0,
  });
  const faqChunckedData = useMemo(() => chunkArray(faqData?.data || [], 2), [faqData]);

  return (
    <div id="homeParent" className="container    transition-all duration-500 ease-in-out ">
      <Breadcrumbs />

      {faqLoading ? (
        <LottieLoading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2  mt-2 gap-3">
          {faqChunckedData?.map((item, index) => (
            <div key={`chunlk${index}`} className="grid gap-3 h-fit">
              {item?.map((e) => (
                <Editable key={e?.id} contentId={e?.id}>
                  {" "}
                  <SimpleAccordion
                    titleIcon={
                      <img className="w-7 h-7 aspect-square" src="/assets/icons/accordion/faq_question_mark.svg" />
                    }
                    item={{ parenClass: " bg-white z-1 rounded-xl border dark:border-zinc-400" }}
                    key={e?.id}
                    title={e?.title}
                  >
                    <div
                      className="text-xs md:text-sm"
                      dangerouslySetInnerHTML={{ __html: e?.full_text || e?.small_text }}
                    />
                  </SimpleAccordion>
                </Editable>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RepetitiveQuestions;
