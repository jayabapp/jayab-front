import type { FaqContentProps } from "@/types/components/modules/content-pages";
import { chunkArray } from "@/helpers/chunk-array.helper";
import { ContentImage } from "@elements/Image";

import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import Breadcrumbs from "@elements/Breadcrumbs/Breadcrumbs.client";
import Editable from "@elements/Editable";

const FaqContent = ({ items }: FaqContentProps) => {
  const faqChunckedData = chunkArray(items || [], 2);

  return (
    <div
      id="homeParent"
      className="container    transition-all duration-500 ease-in-out "
    >
      <Breadcrumbs />

      {items ? (
        <div className="grid grid-cols-1 md:grid-cols-2  mt-2 gap-3">
          {faqChunckedData?.map((item, index) => (
            <div key={`chunlk${index}`} className="grid gap-3 h-fit">
              {item?.map((e) => (
                <Editable key={e?.id} contentId={e?.id}>
                  {" "}
                  <SimpleAccordion
                    titleIcon={
                      <ContentImage
                        alt=""
                        width={28}
                        height={28}
                        className="w-7 h-7 aspect-square"
                        src="/assets/icons/accordion/faq_question_mark.svg"
                      />
                    }
                    item={{
                      parenClass: " bg-white z-1 rounded-xl border ",
                    }}
                    key={e?.id}
                    title={e?.title}
                  >
                    <div
                      className="text-xs content md:text-sm"
                      dangerouslySetInnerHTML={{
                        __html: e?.full_text || e?.small_text,
                      }}
                    />
                  </SimpleAccordion>
                </Editable>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default FaqContent;
