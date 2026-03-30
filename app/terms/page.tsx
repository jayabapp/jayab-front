import _STRINGS from "@/utils/LocalStrings";

import Breadcrumbs from "@/components/BreadCrumbs";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import DOMPurify from "isomorphic-dompurify";
import { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";

export async function generateMetadata(): Promise<Metadata> {
  const { data: aboutUsWebsite } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("terms"));

  return MehaHeaderHelper(aboutUsWebsite);
}

const Terms = async () => {
  const { data: aboutUsWebsite } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("terms"));

  return (
    <div className="container  !overflow-visible">
      <Breadcrumbs />
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3 md:col-span-3 md:mt-6 md:px-4 flex flex-col gap-4 ">
          <div className=" flex flex-col justify-center w-full items-center gap-2">
            {/* <img src="/assets/icons/shared/judges_hammer.svg" className="w-18 aspect-square " /> */}
            <h1 className="    ">{_STRINGS.TERMS}</h1>
          </div>{" "}
          {!aboutUsWebsite ? (
            <LottieLoading />
          ) : (
            <div
              className=" font-light !text-base text-start  content mt-2 leading-8"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(aboutUsWebsite?.html || aboutUsWebsite?.full_text || ""),
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Terms;
