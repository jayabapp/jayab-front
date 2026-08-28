"use client";
import { Question } from "@/api_services/property/property.interface";
import Editable from "@/components/Editable";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import { chunkArray } from "@/helpers/chunk-array.helper";
import React, { useMemo } from "react";

const LandingContentFaq = ({ data }: { data: Question[] }) => {
  const faqChunckedData = useMemo(() => chunkArray(data || [], 2), [data]);
  return (
    <div className=" w-full">
      <div className="grid grid-cols-1 md:grid-cols-2  mt-2 gap-3">
        {faqChunckedData?.map((item, index) => (
          <div key={`chunlk${index}`} className="grid gap-3 h-fit">
            {item?.map((e) => (
              <Editable key={`${e?.id}faqs`} contentId={e?.id}>
                {" "}
                <SimpleAccordion
                  titleIcon={
                    <img className="w-7 h-7 aspect-square" src="/assets/icons/accordion/faq_question_mark.svg" />
                  }
                  item={{ parenClass: " bg-white z-1 rounded-xl border " }}
                  key={e?.updated_at}
                  title={e?.question}
                >
                  <div className="text-xs md:text-sm" dangerouslySetInnerHTML={{ __html: e?.answer || "" }} />
                </SimpleAccordion>
              </Editable>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingContentFaq;
