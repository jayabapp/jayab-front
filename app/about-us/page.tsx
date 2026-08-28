import { LocalBusinessSchema } from "@/components/SchemaGenerator/Schemas";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { getCmsContent } from "@/api_services/home/cms-content.server";
import { ContentImage } from "@/components/elements/Image";

import Breadcrumbs from "@/components/BreadCrumbs";
import DOMPurify from "isomorphic-dompurify";
import Editable from "@/components/Editable";
import _STRINGS from "@/utils/LocalStrings";

const AboutUs = async () => {
  const aboutUs = await getCmsContent("aboutUs");
  return (
    <div
      id="homeParent"
      className="container     transition-all duration-500 ease-in-out "
    >
      <LocalBusinessSchema />
      <Breadcrumbs />

      <div className="flex  flex-col items-center justify-center">
        <img src="/assets/icons/logo/header_logo.svg" className=" max-w-52" />
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
                __html: DOMPurify.sanitize(
                  aboutUs && aboutUs
                    ? aboutUs?.html || aboutUs?.full_text || ""
                    : "",
                  {
                    FORCE_BODY: true,
                    SANITIZE_DOM: true,
                  },
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
                src={NEW_IMAGE_URL(e?.attachment)}
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

export default AboutUs;
