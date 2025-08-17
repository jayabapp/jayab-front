"use client";

import { HomeService } from "@/api_services/home/home.service";
import Breadcrumbs from "@/components/BreadCrumbs";
import Editable from "@/components/Editable";

import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import * as Sentry from "@sentry/nextjs";
import Notify from "@/components/shared/Toast";
import _STRINGS from "@/utils/LocalStrings";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "isomorphic-dompurify";
import React from "react";
import { LocalBusinessSchema } from "@/components/SchemaGenerator/Schemas";

const AboutUs = () => {
  const { data: aboutUs, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "aboutUs"],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "aboutUs" });
    },
  });

  return (
    <div id="homeParent" className="container     transition-all duration-500 ease-in-out ">
      <LocalBusinessSchema />
      <Breadcrumbs />

      <div className="flex  flex-col items-center justify-center">
        <img src="/assets/icons/logo/header_logo.svg" />
        {isLoading ? (
          <LottieLoading />
        ) : aboutUs ? (
          <Editable contentId={aboutUs?.id}>
            {" "}
            <div
              className="w-full mt-4 text-sm md:text-base text-center px-3"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(aboutUs && aboutUs ? aboutUs?.html || aboutUs?.full_text || "" : "", {
                  FORCE_BODY: true,
                  SANITIZE_DOM: true,
                }),
              }}
            />
          </Editable>
        ) : (
          <></>
        )}
        <div className=" mt-8 w-full grid grid-cols-1 gap-4  md:grid-cols-3">
          {aboutUs?.attachments?.map((e) => (
            <div key={`aboutUs${e?.id}`} className=" w-full flex flex-col items-center justify-center gap-4">
              <img src={NEW_IMAGE_URL(e?.attachment)} className="aspect-[1.6] rounded-md  w-full " />

              <p className=" font-medium">{e?.attachment?.alt}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
