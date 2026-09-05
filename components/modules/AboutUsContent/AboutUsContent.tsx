import type { AboutUsContentProps } from "@/types/components/modules/content-pages";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { sanitizeCmsHtml } from "@/helpers/html.generator";
import { ContentImage } from "@elements/Image";

import Breadcrumbs from "@elements/Breadcrumbs/Breadcrumbs.client";
import _STRINGS from "@/utils/LocalStrings";
import Editable from "@elements/Editable";

const AboutUsContent = ({ content: aboutUs }: AboutUsContentProps) => {
  return (
    <div
      id="homeParent"
      className="container     transition-all duration-500 ease-in-out "
    >
      <Breadcrumbs />

      <div className="flex  flex-col items-center justify-center">
        <ContentImage
          alt=""
          width={208}
          height={64}
          src="/assets/icons/logo/header_logo.svg"
          className="h-auto max-w-52"
        />
        {!aboutUs ? (
          <p className="py-12 text-center text-sm text-neutral-500">
            {_STRINGS.ERROR}
          </p>
        ) : aboutUs ? (
          <Editable contentId={aboutUs?.id}>
            {" "}
            <div
              className="w-full mt-4 text-sm md:text-base text-center px-3"
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
