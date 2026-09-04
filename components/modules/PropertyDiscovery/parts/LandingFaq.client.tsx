"use client";

import type { LandingFaqProps } from "@/types/components/modules/property-discovery";
import { chunkArray } from "@/helpers/chunk-array.helper";
import { useMemo } from "react";

import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import DOMPurify from "isomorphic-dompurify";
import Editable from "@elements/Editable";

const FAQ_COLUMNS = 2;

const sanitizeAnswer = (answer: string) =>
  DOMPurify.sanitize(answer, { FORCE_BODY: true, SANITIZE_DOM: true });

const LandingFaq = ({ data }: LandingFaqProps) => {
  const columns = useMemo(
    () =>
      chunkArray(
        (data || []).filter(
          (item) => item.question?.trim() && item.answer?.trim(),
        ),
        FAQ_COLUMNS,
      ),
    [data],
  );

  if (!columns.length) return null;

  return (
    <section className="w-full" aria-labelledby="landing-faq-title">
      <h2 id="landing-faq-title" className="mb-3 text-lg font-bold">
        سوالات متداول
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-2 gap-3">
        {columns?.map((column, index) => (
          <div key={`faq-column-${index}`} className="grid gap-3 h-fit">
            {column?.map((question) => (
              <Editable key={`faq-${question.id}`} contentId={question.id}>
                <SimpleAccordion
                  title={question.question}
                  item={{ parenClass: "bg-white rounded-xl shadow-md my-2" }}
                >
                  <div
                    className="content text-xs md:text-sm"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeAnswer(question.answer || ""),
                    }}
                  />
                </SimpleAccordion>
              </Editable>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingFaq;
