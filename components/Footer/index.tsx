"use client";

import { NEW_IMAGE_URL } from "../../utils/urls";

import { HomeService } from "@/api_services/home/home.service";
import { LandingsPlacements } from "@/enum/landings.enum";
import { chunkArray } from "@/helpers/chunk-array.helper";
import { footerHiddenBlackList, footerLinks } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ContactuUItem from "../contactus/ContactuUItem";
import CallBox from "./CallBox";

const Footer = () => {
  const pathname = usePathname();

  /* --------------------------- SUMMARY DESCRIPTION -------------------------- */

  /* --------------------------- ABOUT US -------------------------- */

  const { data: aboutUs, isLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "aboutUs_footer", 1],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "aboutUs" });
    },
  });

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
  const PHONE_NUMBER = others?.find((i) => i?.fields?.key == "tel" || i?.key == "tel");
  const isHome = pathname == "/";

  /* -------------------------------------------------------------------------- */
  /*                               FOOTER LANDINGS                              */
  /* -------------------------------------------------------------------------- */

  const { data: footerLandings } = useQuery({
    queryKey: [HomeService.USER_LANDING_PAGES_KEY, LandingsPlacements.FOOTER],

    queryFn: () => HomeService.getLandings({ placement: LandingsPlacements.FOOTER }),
  });

  const chunkedLandingsDekstop = chunkArray(footerLandings?.popular_city || [], 9);
  const chunkedLandingsMobile = chunkArray(footerLandings?.popular_city || [], 5);
  return (
    <footer
      className={`  ${isHome ? "" : "  hidden lg:flex"} ${!!footerHiddenBlackList.find((e) => pathname?.includes(e)) ? "hidden lg:hidden" : ""} w-full  z-2   bg-primary-1000/40   flex   flex-col items-center justify-center bg-dark-500  bg-no-repeat bg-cover  relative  pt-[28rem] lg:pt-[6rem] `}
    >
      <CallBox />
      {/* QUICK SEARCHS */}
      <div className=" pb-6  px-0 md:px-[10%]  gap-4 md:gap-4  w-full  flex flex-col  ">
        <p className="  text-base md:text-lg font-bold  px-4 md:px-0    ">{_STRINGS.FAST_SEARCH}</p>

        {/* desktop part */}

        <div className="   hidden md:flex  w-full px-4 pb-2   md:px-0   flex-row lg:grid lg:grid-cols-9 overflow-x-scroll  gap-1.5 md:gap-2.5   ">
          {chunkedLandingsDekstop
            ?.filter((e) => !isEmpty(e))
            ?.map((chunk, index) => (
              <div
                className=" w-2/5 md:w-1/4 lg:w-full shrink-0  lg:auto flex flex-col gap-1.5 md:gap-2.5 "
                key={`${index}chunk`}
              >
                {chunk?.map((e) => (
                  <Link
                    key={e?.title}
                    href={e?.url}
                    prefetch={false}
                    id={e?.title}
                    className="  bg-white    border   shadow-sm   shadow-black/10 border-gray-300  relative  rounded-20 h-6 md:h-8 flex items-center justify-start  pr-4 shrink-0  font-medium text-xs   text-start"
                  >
                    {e?.title}
                  </Link>
                ))}
              </div>
            ))}
        </div>
        {/* mobile part */}
        <div className="    w-full px-4 pb-2   md:px-0  flex md:hidden flex-row  lg:hidden overflow-x-scroll  gap-1.5 md:gap-2.5   ">
          {chunkedLandingsMobile
            ?.filter((e) => !isEmpty(e))
            ?.map((chunk, index) => (
              <div
                className=" w-2/5 md:w-1/4 lg:w-full shrink-0  lg:auto flex flex-col gap-1.5 md:gap-2.5 "
                key={`${index}chunk`}
              >
                {chunk?.map((e) => (
                  <Link
                    key={e?.title}
                    href={e?.url}
                    prefetch={false}
                    id={e?.title}
                    className="  bg-white    border   shadow-sm   shadow-black/10 border-gray-300  relative  rounded-20 h-6 md:h-8 flex items-center justify-start  pr-4 shrink-0  font-medium text-xs   text-start"
                  >
                    {e?.title}
                  </Link>
                ))}
              </div>
            ))}
        </div>
        {/* <div className="w-full ">
          <Divider moreClass=" w-full !border-primary-700 opacity-30  " />
        </div> */}
      </div>
      {!!PHONE_NUMBER && (
        <Link
          href={PHONE_NUMBER?.link || `tel:${PHONE_NUMBER?.full_text || PHONE_NUMBER?.small_text || ""}`}
          className="icon-parent hidden lg:flex fixed z-[100] w-16  items-center justify-center aspect-square rounded-full bg-primary-700   bottom-16 right-16"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" className="" fill="none">
            <path
              className="shake-on-hover"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.0375 7.5608C28.3345 5.76783 25.5175 6.10375 24.1097 8.09484L22.3584 10.5719C21.2323 12.1645 21.3274 14.3786 22.6713 15.7934L23.0114 16.1515C23.0123 16.154 23.0133 16.1566 23.0143 16.1595C23.0323 16.21 23.0778 16.3708 23.033 16.6761C22.9403 17.3087 22.4519 18.5944 20.4691 20.682C18.48 22.7761 17.2735 23.2697 16.7144 23.3605C16.4732 23.3997 16.3471 23.3656 16.3068 23.3515L15.7393 22.7539C14.5257 21.4763 12.6335 21.2246 11.1079 22.1027L8.45442 23.63C6.18648 24.9354 5.65862 28.1287 7.47109 30.0369L9.44407 32.1141C10.0598 32.7624 10.8995 33.3158 11.9371 33.4182C14.4702 33.6683 20.3385 33.3426 26.4904 26.8658C32.2309 20.8221 33.3214 15.5653 33.4593 12.9969L32.5341 12.9473L33.4593 12.9969C33.5274 11.7279 32.9617 10.6395 32.2175 9.85593L30.0375 7.5608ZM25.8108 9.29757C26.5224 8.29111 27.8008 8.23106 28.527 8.99557L30.707 11.2907C31.1672 11.7753 31.4087 12.3307 31.3789 12.8853C31.2664 14.9822 30.3634 19.7632 24.9799 25.431C19.3352 31.3738 14.1348 31.5417 12.1417 31.345C11.7476 31.3061 11.3422 31.0874 10.9546 30.6794L8.98163 28.6022C8.13053 27.7061 8.35362 26.0918 9.4937 25.4356L12.1472 23.9083C12.8593 23.4984 13.6934 23.6251 14.2287 24.1887L14.8613 24.8547L15.5935 24.1592C14.8613 24.8547 14.8623 24.8557 14.8632 24.8567L14.8652 24.8588L14.8693 24.863L14.8781 24.872L14.8981 24.8916C14.9124 24.9055 14.9289 24.9207 14.9475 24.9371C14.9849 24.9698 15.0311 25.0072 15.0866 25.0465C15.1978 25.1254 15.346 25.2122 15.5334 25.2861C15.9168 25.4373 16.423 25.5184 17.0484 25.4169C18.2671 25.2189 19.8645 24.3435 21.9796 22.1168C24.1009 19.8834 24.9128 18.2171 25.0944 16.9781C25.1868 16.3474 25.1128 15.8424 24.9771 15.4611C24.9104 15.2736 24.8316 15.124 24.7589 15.0105C24.7227 14.9538 24.6882 14.9064 24.6576 14.8678C24.6424 14.8486 24.6281 14.8315 24.6151 14.8165L24.5966 14.7957L24.5881 14.7865L24.5841 14.7822L24.5821 14.7801C24.5812 14.7791 24.5802 14.7781 23.8418 15.4794L24.5802 14.7781L24.1818 14.3587C23.563 13.7072 23.4731 12.6039 24.0594 11.7746L25.8108 9.29757Z"
              fill="white"
            />
            <path
              className="pulse-1"
              d="M18.1782 5.87477C18.0863 5.30686 17.5494 4.92162 16.9815 5.01356C16.9464 5.02029 16.8333 5.04143 16.774 5.05463C16.6555 5.08102 16.4902 5.12166 16.2841 5.18169C15.8719 5.30175 15.296 5.49954 14.6049 5.81639C13.2212 6.45077 11.3798 7.5605 9.46894 9.47134C7.5581 11.3822 6.44837 13.2236 5.81399 14.6073C5.49714 15.2984 5.29935 15.8743 5.17929 16.2865C5.11926 16.4926 5.07862 16.6579 5.05223 16.7764C5.03903 16.8357 5.02939 16.8833 5.02266 16.9184L5.01467 16.9617C4.92273 17.5296 5.30446 18.0887 5.87237 18.1806C6.43864 18.2723 6.97212 17.8889 7.06632 17.3237C7.06922 17.3085 7.07718 17.2677 7.08574 17.2293C7.10288 17.1524 7.13252 17.0304 7.17951 16.8691C7.2735 16.5464 7.43674 16.0667 7.70779 15.4755C8.24922 14.2945 9.22282 12.6637 10.9421 10.9445C12.6613 9.22522 14.2921 8.25162 15.4731 7.71019C16.0643 7.43914 16.544 7.2759 16.8667 7.18191C17.028 7.13492 17.2308 7.08837 17.3077 7.07124C17.8729 6.97705 18.2699 6.44105 18.1782 5.87477Z"
              fill="white"
            />
            <path
              className="pulse-2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.8581 10.6679C17.7 10.1147 17.1235 9.79441 16.5703 9.95246L16.8565 10.954C16.5703 9.95246 16.5698 9.9526 16.5694 9.95274L16.5683 9.95303L16.5662 9.95364L16.5616 9.955L16.5508 9.95821L16.5233 9.96677C16.5024 9.97347 16.4762 9.98219 16.4451 9.99326C16.3827 10.0154 16.3002 10.0469 16.1991 10.0902C15.9968 10.1769 15.7203 10.3108 15.3807 10.5118C14.7009 10.9142 13.7728 11.5825 12.6826 12.6727C11.5924 13.7629 10.9241 14.691 10.5217 15.3708C10.3207 15.7104 10.1868 15.9869 10.1001 16.1892C10.0568 16.2903 10.0253 16.3728 10.0032 16.4351C9.9921 16.4663 9.98337 16.4925 9.97668 16.5134L9.96811 16.5409L9.9649 16.5517L9.96355 16.5563L9.96293 16.5584L9.96264 16.5594C9.9625 16.5599 9.96236 16.5604 10.9639 16.8466L9.96236 16.5604C9.80431 17.1136 10.1246 17.6901 10.6778 17.8482C11.2262 18.0049 11.7977 17.6913 11.9614 17.1468L11.9666 17.1318C11.974 17.111 11.9893 17.0699 12.015 17.0099C12.0664 16.89 12.1596 16.6938 12.3146 16.4319C12.6243 15.9086 13.1836 15.118 14.1557 14.1458C15.1279 13.1737 15.9185 12.6144 16.4418 12.3047C16.7037 12.1497 16.8999 12.0565 17.0198 12.0051C17.0798 11.9794 17.1209 11.9641 17.1417 11.9566L17.1567 11.9515C17.7012 11.7878 18.0148 11.2163 17.8581 10.6679Z"
              fill="white"
            />
          </svg>
        </Link>
      )}
      <div className="w-full padding-x lg:w-full mx-auto  py-4 grid grid-cols-4 lg:grid-cols-7 gap-5">
        {/* ABOUT US */}
        <div
          key={`footers`}
          className={`col-span-4 lg:col-span-2  flex w-full flex-col justify-between gap-6 h-fit order-2 lg:order-1 `}
        >
          <Link
            href={"/"}
            prefetch={false}
            referrerPolicy="no-referrer"
            className=" flex items-center gap-4 justify-start"
          >
            <img src="/assets/icons/logo/header_logo.svg" alt={"footer_logo"} className="w-fit  max-w-32 " />
            {/* <div className=" font-bold text-primary-700 text-3xl ">{aboutUs ? aboutUs?.title : _STRINGS?.LOGO}</div> */}
          </Link>

          <p className=" break-words  text-sm dark:text-zinc-100 leading-6 opacity-100  line-clamp-4">
            {!!aboutUs ? aboutUs?.small_text || aboutUs?.full_text : ""}
          </p>
          <div className=" hidden md:flex justify-center md:justify-start mt-3 gap-2 mb-4">
            {socials && socials?.length > 0 ? (
              socials?.map((e) => <ContactuUItem isShiny e={e} key={`${e?.id}SocialcONT`} disableText={true} />)
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className=" hidden md:flex   col-span-1 order-2 lg:order-1"></div>
        <div
          key={`footerasfs`}
          className={`col-span-4 lg:col-span-1  gap-2 flex w-full flex-col justify-between h-fit order-2 lg:order-1 `}
        >
          <p className=" text-base md:text-lg font-bold  pb-4">{_STRINGS.FAST_ACCESS}</p>
          <div className=" lg:grid-cols-1  grid grid-cols-2 gap-2  grid-rows-2  lg:grid-rows-none ">
            {footerLinks?.map((e, index) => (
              <Link
                prefetch={false}
                key={`FOOTER@${e.id}${index}`}
                href={e.route || "#"}
                style={{ textDecoration: "none" }}
                className="flex items-center gap-2 mb-2"
              >
                {/* <img
                src="/assets/icons/footer/footer_bullet.svg"
                alt={`${e?.title}dot`}
                className="w-4 aspect-square h-4 "
              /> */}
                <p className=" text-sm  cursor-pointer  opacity-100 hover:text-primary-700">{e?.title}</p>
              </Link>
            ))}
          </div>
        </div>{" "}
        <div className=" hidden md:flex   col-span-1 order-2 lg:order-1"></div>
        {/* CONTACT US */}
        <div
          key={`foossters`}
          className={`col-span-4 lg:col-span-2  flex w-full flex-col justify-between h-fit order-2 lg:order-1 `}
        >
          <div className="flex justify-center flex-col gap-4  mt-3 mb-4">
            <p className=" text-base md:text-lg font-bold  pb-0 lg:pb-4">{_STRINGS.COMUNICATION_WAYS}</p>
            {others && others?.length > 0 ? (
              others?.map((e) => <ContactuUItem e={e} textClass=" !font-normal " key={`${e?.id}SocialcONT`} />)
            ) : (
              <></>
            )}
          </div>

          {process.env.NEXT_PUBLIC_ENAMAD_ID && process.env.NEXT_PUBLIC_ENAMAD_CODE && (
            <div className="flex flex-row w-fit  items-center justify-center gap-5">
              <a
                referrerPolicy="origin"
                className="w-16 h-16"
                target="_blank"
                href={`https://trustseal.enamad.ir/?id=${process.env.NEXT_PUBLIC_ENAMAD_ID}&Code=${process.env.NEXT_PUBLIC_ENAMAD_CODE}`}
              >
                <img
                  referrerPolicy="origin"
                  className="w-16 h-16"
                  src={`https://trustseal.enamad.ir/logo.aspx?id=${process.env.NEXT_PUBLIC_ENAMAD_ID}&Code=${process.env.NEXT_PUBLIC_ENAMAD_CODE}`}
                  alt=""
                  id={process.env.NEXT_PUBLIC_ENAMAD_CODE}
                />
              </a>
            </div>
          )}
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

      {/* BOTTOM WARNINGS */}

      <div className="bg-white   padding-x  w-full  mx-auto  shadow-md    h-fit   lg:h-20 flex flex-col  py-2 md:py-0 gap-4 lg:flex-row   items-center justify-between  ">
        <div className="  flex    items-center gap-4">
          <div className="w-full   dark:text-zinc-100  text-center text-xxs md:text-sm  ">
            تمامی حقوق مادی و معنوی این وبسایت متعلق به شرکت
            <a className="text-blue-500 underline underline-offset-2" href="/">
              &nbsp; جایاب &nbsp;
            </a>
            میباشد
          </div>
        </div>
        <div className="flex gap-2  items-center">
          {downloadLink?.data?.map((e) => (
            <Link
              key={`downloadLink${e?.id}`}
              target="_blank"
              href={e?.link || ""}
              className="aspect-[3] max-w-[120px] "
              referrerPolicy="no-referrer"
              prefetch={false}
            >
              <img src={NEW_IMAGE_URL(e?.feature_image)} className=" h-10  object-contain md:max-w-[120px] " />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
