import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { sanitizeCmsHtml } from "@/helpers/html.generator";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { BrandTitle } from "@elements/BrandTitle";

import type { AboutUsContentProps } from "@/types/components/modules/content-pages";

import Breadcrumbs from "@elements/Breadcrumbs/Breadcrumbs.client";
import Editable from "@elements/Editable";

const AboutUsContent = ({ content: aboutUs }: AboutUsContentProps) => {
  const t = useTranslations("common");

  return (
    <div
      id="homeParent"
      className="container transition-all duration-500 ease-in-out"
    >
      <Breadcrumbs />

      <div className="flex  flex-col items-center justify-center">
        <div className="flex items-center gap-3">
          <ContentImage
            alt=""
            width={64}
            height={64}
            className="size-16"
            src="/assets/icons/logo/mark.svg"
          />
          <BrandTitle tone="blue" className="h-9 w-auto" />
        </div>
        {!aboutUs ? (
          <p className="py-12 text-center text-sm text-ink-subtle">
            {t("error")}
          </p>
        ) : aboutUs ? (
          <Editable contentId={aboutUs?.id}>
            {" "}
            <div
              className="w-full mt-4 text-sm md:text-base text-justify px-3"
              dangerouslySetInnerHTML={{
                __html: sanitizeCmsHtml(
                  aboutUs && aboutUs
                    ? aboutUs?.html || aboutUs?.full_text || ""
                    : "",
                ),
              }}
            />
          </Editable>
        ) : (
          <></>
        )}
        <div className=" mt-8 w-full grid grid-cols-1 gap-4  md:grid-cols-3">
          {aboutUs?.attachments?.map((e: any) => (
            <div
              key={`aboutUs${e?.id}`}
              className=" w-full flex flex-col items-center justify-center gap-4"
            >
              <ContentImage
                width={1024}
                height={640}
                alt={e?.attachment?.alt || ""}
                src={getHomeImageUrl(e?.attachment)}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="aspect-[1.6] rounded-md w-full object-cover"
              />

              <p className=" font-medium">{e?.attachment?.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
