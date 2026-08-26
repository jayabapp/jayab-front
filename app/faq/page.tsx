import SimpleAccordion from "@/components/shared/SimpleAccorion";

import { ContentDto } from "@/api_services/home/home.interface";
import Breadcrumbs from "@/components/BreadCrumbs";
import Editable from "@/components/Editable";
import { FaqSchema } from "@/components/SchemaGenerator/Schemas";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { chunkArray } from "@/helpers/chunk-array.helper";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";

const RepetitiveQuestions = async () => {
  const { data: faqData }: { data: { data: ContentDto[] } } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"faq"}&per_page=20&page=${1}`,
  );

  const faqChunckedData = chunkArray(faqData?.data || [], 2);

  return (
    <div id="homeParent" className="container    transition-all duration-500 ease-in-out ">
      <FaqSchema />
      <Breadcrumbs />

      {!faqData ? (
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
                      className="text-xs content md:text-sm"
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
