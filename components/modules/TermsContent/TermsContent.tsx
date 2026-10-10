import { sanitizeCmsHtml } from "@/helpers/html.generator";
import { useTranslations } from "next-intl";

import type { TermsContentProps } from "@/types/components/modules/content-pages";

import Breadcrumbs from "@elements/Breadcrumbs/Breadcrumbs.client";

const TermsContent = ({ content: aboutUsWebsite }: TermsContentProps) => {
  const t = useTranslations("common");

  return (
    <div className="container  !overflow-visible">
      <Breadcrumbs />
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3 md:col-span-3 md:mt-6 md:px-4 flex flex-col gap-4 ">
          <div className=" flex flex-col justify-center w-full items-center gap-2">
            <h1 className="    ">{t("terms")}</h1>
          </div>{" "}
          {!aboutUsWebsite ? (
            <p className="py-12 text-center text-sm text-ink-subtle">
              {t("error")}
            </p>
          ) : (
            <div
              className=" font-light !text-base text-start  content mt-2 leading-8"
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(
                  aboutUsWebsite?.html || aboutUsWebsite?.full_text || "",
                ),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsContent;
