import { apiRoutes, baseUrl } from "@/utils/urls";
import { REVALIDATE } from "@/helpers/revalidate";
import { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Breadcrumbs from "@/components/BreadCrumbs";
import serverCall from "@/helpers/serverCall";
import DOMPurify from "isomorphic-dompurify";
import _STRINGS from "@/utils/LocalStrings";

export async function generateMetadata(): Promise<Metadata> {
  const { data: aboutUsWebsite } = await serverCall(
    baseUrl + apiRoutes.CONTENT_BY_KEY("terms"),
    undefined,
    {
      revalidate: REVALIDATE.CMS_PAGE,
    },
  );

  return MehaHeaderHelper(aboutUsWebsite);
}

const Terms = async () => {
  const { data: aboutUsWebsite } = await serverCall(
    baseUrl + apiRoutes.CONTENT_BY_KEY("terms"),
    undefined,
    {
      revalidate: REVALIDATE.CMS_PAGE,
    },
  );

  return (
    <div className="container  !overflow-visible">
      <Breadcrumbs />
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3 md:col-span-3 md:mt-6 md:px-4 flex flex-col gap-4 ">
          <div className=" flex flex-col justify-center w-full items-center gap-2">
            <h1 className="    ">{_STRINGS.TERMS}</h1>
          </div>{" "}
          {!aboutUsWebsite ? (
            <LottieLoading />
          ) : (
            <div
              className=" font-light !text-base text-start  content mt-2 leading-8"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
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

export default Terms;
