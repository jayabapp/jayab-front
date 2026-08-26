import { getServerContentList } from "@features/home/server/home.server";
import { chunkArray } from "@/helpers/chunk-array.helper";
import { ContentDto } from "@/api_services/home/home.interface";
import { FaqSchema } from "@/components/SchemaGenerator/Schemas";

import SimpleAccordion from "@/components/shared/SimpleAccorion";
import Breadcrumbs from "@/components/BreadCrumbs";
import Editable from "@/components/Editable";

const RepetitiveQuestions = async () => {
  const { data: faqData }: { data: { data: ContentDto[] } } =
    await getServerContentList("faq", 1, 20);

  const faqChunckedData = chunkArray(faqData?.data || [], 2);

  return (
    <div
      id="homeParent"
      className="container    transition-all duration-500 ease-in-out "
    >
      <FaqSchema />
      <Breadcrumbs />

      {faqData ? (
        <div className="grid grid-cols-1 md:grid-cols-2  mt-2 gap-3">
          {faqChunckedData?.map((item, index) => (
            <div key={`chunlk${index}`} className="grid gap-3 h-fit">
              {item?.map((e) => (
                <Editable key={e?.id} contentId={e?.id}>
                  {" "}
                  <SimpleAccordion
                    titleIcon={
                      <img
                        className="w-7 h-7 aspect-square"
                        src="/assets/icons/accordion/faq_question_mark.svg"
                      />
                    }
                    item={{
                      parenClass:
                        " bg-white z-1 rounded-xl border dark:border-zinc-400",
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

export default RepetitiveQuestions;
