import { apiRoutes, baseUrl, NEW_IMAGE_URL } from "@/utils/urls";
import { LocalBusinessSchema } from "@/components/SchemaGenerator/Schemas";
import { REVALIDATE } from "@/helpers/revalidate";

import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Breadcrumbs from "@/components/BreadCrumbs";
import serverCall from "@/helpers/serverCall";
import DOMPurify from "isomorphic-dompurify";
import Editable from "@/components/Editable";

const AboutUs = async () => {
  const { data: aboutUs } = await serverCall(
    baseUrl + apiRoutes.CONTENT_BY_KEY("aboutUs"),
    undefined,
    {
      revalidate: REVALIDATE.CMS_PAGE,
    },
  );
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
          <LottieLoading />
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
              <img
                src={NEW_IMAGE_URL(e?.attachment)}
                className="aspect-[1.6] rounded-md  w-full "
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
