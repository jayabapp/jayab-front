"use client";

import React, { useEffect, useState } from "react";
import _STRINGS from "../../utils/LocalStrings";
import { apiRoutes, imageUrlBase, NEW_IMAGE_URL } from "../../utils/urls";
import SocialList from "./SocialList";

import FormInput from "../shared/Form/FormInput";
import Button from "../shared/Button/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import Link from "next/link";
import { HomeService } from "@/api_services/home/home.service";
import CallBox from "./CallBox";
import { footerLinks } from "@/utils/constantss";
import ContactuUItem from "../contactus/ContactuUItem";

const Footer = () => {
  /* --------------------------- SUMMARY DESCRIPTION -------------------------- */

  /* --------------------------- ABOUT US -------------------------- */

  const { data: aboutUs, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "aboutUs_footer", 1],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "aboutUs" });
    },
  });

  const _findAction = (key: string, value: string, action: string) => {
    if (!key) return;
    if (action) window.open(`${action}${value}`, "_self");
    else window.open(value, "_self");
  };
  /* ----------------------------- DOWNLOAD LINKS ----------------------------- */

  const { data: downloadLink } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, "downloadLinks", 1],
    queryFn: () => {
      return HomeService.GetContent({ key: "downloadLinks", page: 1 });
    },
  });

  const { data } = useQuery({
    queryKey: [HomeService?.CONTENTS_CACHEKEY, "contactUs", 1],
    queryFn: () => {
      return HomeService.GetContent({ key: "contactUs", page: 1 });
    },
  });
  const socials = data?.data?.filter((e: any) => e?.fields?.key == "social");
  const others = data?.data?.filter((e) => e?.fields?.key !== "social");
  return (
    <div className="w-full  pb-6 bg-primary-200 hidden  lg:flex flex-col items-center justify-center bg-dark-500  bg-no-repeat bg-cover  relative pt-[6rem] ">
      <CallBox />
      <div className="w-12/12 lg:w-[90%] mx-auto  py-4 grid grid-cols-4 lg:grid-cols-6 gap-5">
        {/* ABOUT US */}
        <div
          key={`footers`}
          className={`col-span-4 lg:col-span-2  flex w-full flex-col justify-between gap-6 h-fit order-2 lg:order-1 `}
        >
          <div className=" flex items-center gap-4 justify-start">
            <img src="/assets/icons/logo/header_logo.svg" alt={"footer_logo"} className="w-fit " />
            {/* <div className=" font-bold text-primary-700 text-3xl ">{aboutUs ? aboutUs?.title : _STRINGS?.LOGO}</div> */}
          </div>

          <p className=" break-words font-light text-sm dark:text-zinc-100 leading-6 opacity-100  line-clamp-4">
            {!!aboutUs ? aboutUs?.small_text || aboutUs?.full_text : ""}
          </p>
          <div className=" hidden md:flex justify-center md:justify-start mt-3 gap-2 mb-4">
            {socials && socials?.length > 0 ? (
              socials?.map((e) => <ContactuUItem e={e} key={`${e?.id}SocialcONT`} disableText={true} />)
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className=" col-span-1 order-2 lg:order-1"></div>
        <div
          key={`footerasfs`}
          className={`col-span-3 lg:col-span-1  gap-2 flex w-full flex-col justify-between h-fit order-2 lg:order-1 `}
        >
          {footerLinks?.map((e, index) => (
            <Link
              prefetch={false}
              key={`FOOTER@${e.id}${index}`}
              href={e.route || "#"}
              style={{ textDecoration: "none" }}
              className="flex items-center gap-2 mb-2"
            >
              <img
                src="/assets/icons/footer/footer_bullet.svg"
                alt={`${e?.title}dot`}
                className="w-4 aspect-square h-4 "
              />
              <p className=" text-sm  cursor-pointer  opacity-100 hover:text-primary-700">{e?.title}</p>
            </Link>
          ))}
        </div>

        {/* CONTACT US */}
        <div
          key={`foossters`}
          className={`col-span-4 lg:col-span-2  flex w-full flex-col justify-between h-fit order-2 lg:order-1 `}
        >
          <div className="flex justify-center flex-col gap-4  mt-3 mb-4">
            {others && others?.length > 0 ? (
              others?.map((e) => <ContactuUItem e={e} textClass=" !font-normal " key={`${e?.id}SocialcONT`} />)
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* SOCIALS */}
      </div>
      {/* SOCIAL IN MOBILE */}
      <div className="md:hidden flex flex-col gap-2 items-center justify-center">
        <div className=" flex justify-center md:justify-start mt-3 mb-4 gap-2">
          {socials && socials?.length > 0 ? (
            socials?.map((e) => <ContactuUItem e={e} key={`${e?.id}SocialcONT`} disableText={true} />)
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* SECTION 4 */}

      <div className="bg-white   rounded-20 w-9/10  mx-auto px-4 shadow-md   lg:w-[90%] h-14  md:h-20 flex items-center justify-between  ">
        <div className="  hidden md:flex    items-center gap-4">
          <div className="w-full   dark:text-zinc-100  text-center text-sm  ">
            تمامی حقوق مادی و معنوی این وبسایت متعلق به شرکت .
            <a className="text-blue-500 underline underline-offset-2" href="">
              &nbsp; جایاب &nbsp;
            </a>
            دیزاین میباشد
          </div>
        </div>
        <div className="flex gap-2  items-center">
          {downloadLink?.data?.map((e) => (
            <Link
              target="_blank"
              href={e?.link || ""}
              className="aspect-[3] max-w-[120px] "
              referrerPolicy="no-referrer"
              prefetch={false}
            >
              <img src={NEW_IMAGE_URL(e?.feature_image)} className="aspect-[3] max-w-[120px] " />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
