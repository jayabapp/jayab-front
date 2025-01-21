import React from "react";
import _STRINGS from "@/utils/LocalStrings";

import DOMPurify from "isomorphic-dompurify";
import { Metadata } from "next";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl } from "@/utils/urls";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Breadcrumbs from "@/components/BreadCrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const { data: aboutUsWebsite } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("terms"));

  return {
    title: aboutUsWebsite?.seo?.metaTitle || "آئین نامه و قوانین مقررات استفاده از اپلیکیشن جیبینو ",
    description:
      aboutUsWebsite?.seo?.metaDescription ||
      " انجام تمامی خریدها در پلتفرم جیبینو اعم از خریدهای داخل و خارج از درگاه های جیبینو خواه به صورت امتیازی یا ریالی در هر زمان به معنی پذیرفتن کامل کلیه شرایط و قوانین جیبینو از سوی کاربر است",
  };
}

const Terms = async () => {
  const { data: aboutUsWebsite } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("terms"));

  return (
    <div className="app-container  !overflow-visible">
      <Breadcrumbs />
      <div className="grid grid-cols-3 gap-4">
        <div className=" col-span-3 md:col-span-3 md:mt-6 md:px-4 flex flex-col gap-8 ">
          <div className=" flex flex-col justify-center w-full items-center gap-2">
            <img src="/assets/icons/shared/judges_hammer.svg" className="w-18 aspect-square " />
            <p className="  text-2xl  text-primary-700 font-bold  ">{_STRINGS.TERMS}</p>
          </div>{" "}
          {!aboutUsWebsite ? (
            <LottieLoading />
          ) : (
            <div
              className=" font-light !text-base text-justify mt-2 leading-8"
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
