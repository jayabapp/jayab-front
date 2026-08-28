import { getCmsContent } from "@/api_services/home/cms-content.server";
import { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import Breadcrumbs from "@/components/BreadCrumbs";
import DOMPurify from "isomorphic-dompurify";
import _STRINGS from "@/utils/LocalStrings";

export async function generateMetadata(): Promise<Metadata> {
  return MehaHeaderHelper(await getCmsContent("terms"));
}

const Terms = async () => {
  const aboutUsWebsite = await getCmsContent("terms");

  return (
    <div className="container  !overflow-visible">
      <Breadcrumbs />
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3 md:col-span-3 md:mt-6 md:px-4 flex flex-col gap-4 ">
          <div className=" flex flex-col justify-center w-full items-center gap-2">
            <h1 className="    ">{_STRINGS.TERMS}</h1>
          </div>{" "}
          {!aboutUsWebsite ? (
            <p className="py-12 text-center text-sm text-neutral-500">
              {_STRINGS.ERROR}
            </p>
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
