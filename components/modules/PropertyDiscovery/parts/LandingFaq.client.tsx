"use client";

import type { LandingFaqProps } from "@/types/components/modules/property-discovery";
import { chunkArray } from "@/helpers/chunk-array.helper";
import { ContentImage } from "@elements/Image";
import { useMemo } from "react";

import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import Editable from "@elements/Editable";

const FAQ_COLUMNS = 2;

const LandingFaq = ({ data }: LandingFaqProps) => {
  const columns = useMemo(() => chunkArray(data || [], FAQ_COLUMNS), [data]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-3">
        {columns?.map((column, index) => (
          <div key={`faq-column-${index}`} className="grid gap-3 h-fit">
            {column?.map((question) => (
              <Editable key={`faq-${question?.id}`} contentId={question?.id}>
                <SimpleAccordion
                  title={question?.question}
                  item={{ parenClass: " bg-white z-1 rounded-xl border " }}
                  titleIcon={
                    <ContentImage
                      alt=""
                      width={28}
                      height={28}
                      className="w-7 h-7 aspect-square"
                      src="/assets/icons/accordion/faq_question_mark.svg"
                    />
                  }
                >
                  <div
                    className="text-xs md:text-sm"
                    dangerouslySetInnerHTML={{ __html: question?.answer || "" }}
                  />
                </SimpleAccordion>
              </Editable>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingFaq;
