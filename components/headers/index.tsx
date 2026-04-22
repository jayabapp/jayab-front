"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

import _STRINGS from "@/utils/LocalStrings";

import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { ChatService } from "@/api_services/chat/chat.service";
import { PropertyService } from "@/api_services/property/property.service";
import { ReserveService } from "@/api_services/reserve/reserve.service";
import { UserService } from "@/api_services/user/user.service";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { headerMobileSearchBlackList, headerWithFullSeach } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { throttle } from "lodash";
import moment from "moment-jalaali";
import HomeCityFilterCityPart from "../Home/HomeCityFilterContainer/HomeCityFilterCityPart";
import Button from "../shared/Button/Button";
import DrawerMenu from "../shared/DrawerMenu";
import AbsoluteBadge from "./AbsoluteBadge";
import HeaderTitle from "./HeaderTitle";
import ProfileDropdown from "./ProfileDropdown";
const PopSearchbox = dynamic(() => import("../SearchBoxComp/PopSearchbox"), {
  ssr: true,
});

type textIconType = {
  item: { route?: string; icon?: string; title: string; hasBadge?: boolean; cb?: () => void | null };
  isHome: boolean;
  visibleTopHeader?: boolean;
};

const Pulser = ({ className }: { className?: string }) => (
  <div
    className={`w-2 h-2 rounded-full  absolute -left-2 z-1 -top-0.5 bg-red-600 animate-pulse transition-all ${className}`}
  ></div>
);

const TextIcon = ({ item, isHome, visibleTopHeader }: textIconType) => {
  const parentClass = "flex items-center relative transition-all  group  justify-center col-span-1 gap-2 flex-row ";
  const textColor = isHome && visibleTopHeader ? "text-white" : "text-black";
  if (!!item?.route) {
    return (
      <Link prefetch={false} href={item?.route || ""} className={parentClass}>
        {item?.hasBadge ? <Pulser /> : <></>}

        {/* <img
      src={item?.icon}
      className={`dark:invert  brightness-125 group-hover:brightness-100 group-hover:grayscale-0  grayscale `}
    /> */}
        <p
          className={`${textColor}  text-sm lg:text-base transition-all duration-100  shrink-0  font-medium  group-hover:brightness-100 group-hover:text-primary-700  `}
        >
          {item?.title}
        </p>
      </Link>
    );
  } else
    return (
      <div onClick={item?.cb} className={parentClass}>
        {item?.hasBadge ? <Pulser /> : <></>}

        {/* <img
      src={item?.icon}
      className={`dark:invert  brightness-125 group-hover:brightness-100 group-hover:grayscale-0  grayscale `}
    /> */}
        <p
          className={`${textColor} ${visibleTopHeader} shrink-0 text-sm lg:text-base   cursor-pointer ransition-all duration-100 font-medium  group-hover:brightness-100 group-hover:text-primary-700  `}
        >
          {item?.title}
        </p>
      </div>
    );
};

const Header = ({ scroll }: { scroll?: number }) => {
  const { userInfo } = useStoreInit((data) => data);

  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { room_slug, slug, chat_id } = params;
  const { isLogin } = useAuthStore((state: any) => state);
  const { getBackHome, topHeaderVisible } = useStoreParams((state: any) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogins, setShowLogins] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                              TOP HEADER STORE                              */
  /* -------------------------------------------------------------------------- */

  const showTopHeader = () => {
    useStoreParams.setState({ topHeaderVisible: true });
  };
  const hideTopHeader = () => {
    useStoreParams.setState({ topHeaderVisible: false });
  };

  ////////////////

  useEffect(() => {
    setTimeout(() => {
      setShowLogins(true);
    }, 1000);
  }, []);

  // const [visibleTopHeader, setVisibleTopHeader] = useState(true);
  // const [theme, setTheme] = useState("dark");

  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);
    const temp = localStorage.getItem("theme");
    const isLoginTemp = localStorage.getItem("isLogin");
    useAuthStore.setState({ isLogin: isLoginTemp === "true" ? true : false });

    return () => window?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = throttle((event) => {
    if (window?.scrollY > 60) hideTopHeader();
    else showTopHeader();
  }, 100);

  useEffect(() => {
    if (scroll) {
      if (scroll > 60) hideTopHeader();
      else showTopHeader();
    }
  }, [scroll]);

  /* -------------------------- GET USER FOR DROPDOWN ------------------------- */
  const path = pathname;
  const isInSearch = path.includes("products?");

  const pusher = (link: string) => {
    router.push(link);
  };

  const pathnameArray = pathname.split("/");
  const isInProfile = pathnameArray?.includes("profile");

  const isInProducts = pathname.includes("/products/");

  ////////////////////////////

  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  /* -------------------------------------------------------------------------- */
  /*                                 NOTIF BADGE                                */
  /* -------------------------------------------------------------------------- */
  const { data: notifBadge } = useQuery({
    queryKey: [UserService.NOTIFS_BADGE_CACHEKEY, isLogin, pathname],
    queryFn: () => {
      if (!!isLogin && pathname == "/") {
        return UserService.userNotifBadge();
      } else {
        return null;
      }
    },
  });
  const { data: chaNotifBadge } = useQuery({
    queryKey: [ChatService.UNREAD_CHAT_COUNT_CACHEKEY, isLogin, pathname],
    queryFn: () => {
      if (!!isLogin && (pathname == "/" || pathname == "/chat")) {
        return ChatService.getUnreadChatCount();
      } else return null;
    },
    refetchOnWindowFocus: true,
  });

  const onCreateAddClick = () => {
    if (!!userInfo) {
      if (!userInfo?.owner_id) {
        router.push(`/profile/edit`);
      } else {
        refetch().then((e) => {
          if (!!e?.data) router.push(`/profile/owner/properties/${e?.data?.id}/edit/initials`);
        });
      }
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  const registerAdvisor = () => {
    if (isLogin) {
      router.push("/profile/advisor/subscription");
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  /* -------------------------------------------------------------------------- */
  /*                               ADVISOR STATUS                               */
  /* -------------------------------------------------------------------------- */

  const { data: advisorProfile } = useQuery({
    queryKey: [AdvisorService.USER_ADVISORS_PROFILE_CACHEKEY, isLogin],

    queryFn: () => {
      if (!!isLogin) return AdvisorService.userAdvisorsProfile();
      else return null;
    },
  });
  const isActive = moment().isBefore(advisorProfile?.subscription_expired_at);
  const remainingDays = moment(advisorProfile?.subscription_expired_at).diff(moment(), "days");

  const hasBadge =
    (advisorProfile?.status?.id == 20 && !!isActive && remainingDays <= 3) ||
    (advisorProfile?.status?.id == 20 && !isActive);

  /* -------------------------------------------------------------------------- */
  /*                               ACTIVE RESERVE                               */
  /* -------------------------------------------------------------------------- */

  const { data: activeReserve } = useQuery({
    queryKey: [ReserveService.RESERVE_ACTIVE_CACHEKEY, isLogin],
    enabled: isLogin,

    queryFn: ReserveService.activeReserve,
  });
  const isHome = pathname == "/" ? true : false;

  const isHeaderLight = isHome && topHeaderVisible;

  const MenuProfileItem = () => {
    return (
      // <div
      //   className={` flex items-center transition-all   rounded-full ${isHeaderLight ? "border-white " : "border-gray-500"} bg-white/40    border   p-1 pr-3  brightness-125 hover:brightness-100  justify-center col-span-1 gap-3 flex-row`}
      // >
      //   <MenuDropDown isHeaderLight={isHeaderLight} />
      //   {isLogin ? (
      <div className=" flex items-center gap-6">
        <Link
          href={!!isLogin ? "/profile" : "/auth"}
          prefetch={false}
          className={`  ${isHeaderLight ? "border-white " : "border-gray-500"} border  transition-all   rounded-full flex items-center justify-center`}
        >
          <img
            src="/assets/icons/header/new-face/user.svg"
            className={`${isHeaderLight ? "" : "invert"} transition-all`}
          />
        </Link>

        {showLogins ? (
          isLogin ? (
            <>
              {" "}
              <Link
                prefetch={false}
                href={"/notifications"}
                className="relative w-5 h-5 transition-all aspect-square  shrink-0 flex   lg:hidden"
              >
                <AbsoluteBadge count={notifBadge || 0} />
                <img
                  alt="notificatons"
                  src="/assets/icons/header/white_bell.svg"
                  className={`w-5 h-5 transition-all aspect-square  shrink-0 ${isHeaderLight ? "" : "invert   opacity-40"} `}
                />
              </Link>
            </>
          ) : (
            <></>
          )
        ) : (
          <></>
        )}
      </div>
      //   ) : (
      //     <div className="flex shrink-0  items-center gap-2 pl-2">
      //       <TextIcon
      //         visibleTopHeader={topHeaderVisible}
      //         isHome={isHome}
      //         item={{
      //           icon: "/assets/icons/header/adds_header_icon.svg",
      //           title: `${_STRINGS?.ENTER} / ${_STRINGS?.REGISTER}`,
      //           route: "/auth",
      //         }}
      //       />
      //     </div>
      //   )}
      // </div>
    );
  };
  return (
    <header className="relative">
      <div
        id="headerContainer"
        className={`
     ${isHome && topHeaderVisible ? "  bg-gradient-to-b     from-black/40 to-black/0  md:pb-24    " : topHeaderVisible ? "" : "   "}

transition-all ease-out  duration-300  header-content-container w-full mx-auto     dark:bg-dark-900    `}
      >
        {/* ROW 1 */}
        <div
          className={`flex justify-between  transition-all items-center  xl:gap-[10%]   duration-300  padding-x  py-2 lg:py-4   ${isHeaderLight ? "    bg-transparent " : topHeaderVisible ? "   bg-white   " : `   bg-white    ${headerWithFullSeach.includes(pathname) || !!params?.slug ? " border-b  lg:border-b-0  lg:shadow-lg" : "shadow-lg"}  `} `}
        >
          <div className=" lg:hidden flex w-full  ">
            {isHome ? (
              <div className="w-full flex items-center  py-1  rounded-full justify-between pl-2 pr-1.5 gap-2">
                <MenuProfileItem />

                <div className="flex items-center gap-6">
                  <div className={` ${topHeaderVisible ? "hidden" : "  flex"} transition-all `}>
                    <Suspense>
                      <PopSearchbox
                        justIcon
                        boxId={scroll ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"}
                        placeholder={_STRINGS?.SEARCH}
                        onSubmit={(text) => {}}
                        onClear={() => {}}
                        item={{ bg: "" }}
                        autofocus={isInSearch}
                      />
                    </Suspense>
                  </div>

                  <div className="flex items-center gap-1 justify-center">
                    <img
                      className={`w-16 ${topHeaderVisible ? "flex" : "hidden"} `}
                      src="/assets/icons/logo/just_title_logo.svg"
                    />
                    <img className="w-10 h-10 aspect-square" src="/assets/icons/logo/header_mobile_logo.svg" />
                  </div>
                </div>
              </div>
            ) : (headerWithFullSeach.includes(pathname) && !room_slug && !slug) || (!!slug && !room_slug) ? (
              <div className="flex items-center w-full justify-between  gap-4">
                {/* {" "}
                <img
                  src="/assets/icons/shared/chevron-right.svg"
                  onClick={(e) => {
                    if (!!getBackHome && (!!room_slug || !!chat_id)) {
                      removeredirectRoomToHome();
                      router.push("/");
                    } else if (pathname == "/profile/orders" || (!!slug && !room_slug)) {
                      router.push("/");
                    } else {
                      router.back();
                    }
                  }}
                  className="cursor-pointer w-12 h-4      "
                  // src="/assets/icons/addresses/garbage.svg"
                /> */}
                <div className=" flex  w-full border  bg-white rounded-full items-center gap-2  pl-4">
                  <Suspense>
                    <PopSearchbox
                      boxId={scroll ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"}
                      placeholder={_STRINGS?.SEARCH}
                      onSubmit={(text) => {}}
                      onClear={() => {}}
                      containerClass={" w-full mx-auto"}
                      item={{ bg: `!bg-transparent  !border-none ` }}
                      autofocus={isInSearch}
                    />
                  </Suspense>
                  <div className="w-[1px] h-8 bg-gray-300"></div>
                  <HomeCityFilterCityPart />
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full justify-between  gap-4">
                {" "}
                <img
                  src="/assets/icons/shared/chevron-right.svg"
                  onClick={(e) => {
                    if (!!getBackHome && (!!room_slug || !!chat_id)) {
                      removeredirectRoomToHome();
                      router.push("/");
                    } else if (pathname == "/profile/orders" || (!!slug && !room_slug)) {
                      router.push("/");
                    } else {
                      router.back();
                    }
                  }}
                  className="cursor-pointer w-12 h-4      "
                  // src="/assets/icons/addresses/garbage.svg"
                />
                <p className="font-bold text-base text-center">
                  <HeaderTitle />
                </p>
                <div className="  w-12 h-10   flex items-center justify-center">
                  {" "}
                  <div className="cursor-pointer  absolute left-4     ">
                    {/**************     IN ADVISORS PAGE  WE NEED ADVISOR CREATE BUTTON  ***************/}

                    {pathname == "/advisors" ? (
                      !userInfo?.advisor_id && !!showLogins ? (
                        <Button
                          roundedClass="rounded-full"
                          width=" !px-3  !text-sm !py-1 w-fit "
                          containerClass="w-fit !px-0.5  items-center justify-center"
                          onClick={registerAdvisor}
                          title={_STRINGS.REGISTER_ADVISOR}
                        />
                      ) : (
                        <></>
                      )
                    ) : pathname.includes("/profile") ? (
                      <Link
                        onClick={() => {
                          removeredirectRoomToHome();
                        }}
                        href={"/"}
                      >
                        <img
                          src="/assets/icons/navbar/home_nav.svg"
                          className="transition-all grayscale opacity-50  hover:opacity-100 hover:grayscale-0"
                        />
                      </Link>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {headerMobileSearchBlackList.find((e) => pathname?.includes(e)) ? (
                          <></>
                        ) : pathname.includes("/rooms/") ? (
                          <Link
                            onClick={() => {
                              // removeLocalBackHomeFunc();
                            }}
                            className="w-5 h-5 aspect-square"
                            href={"/"}
                          >
                            <img
                              src="/assets/icons/navbar/home_nav_black.svg"
                              className="transition-all grayscale opacity-60  hover:opacity-100 hover:grayscale-0"
                            />
                          </Link>
                        ) : (
                          <Suspense>
                            <PopSearchbox
                              justIcon
                              boxId={scroll ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"}
                              placeholder={_STRINGS?.SEARCH}
                              onSubmit={(text) => {}}
                              onClear={() => {}}
                              item={{ bg: "" }}
                              autofocus={isInSearch}
                            />
                          </Suspense>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className={` text-xs   lg:text-md   gap-8 font-medium flex-row hidden lg:flex w-[50%] transition-all ease-in-out duration-1000 items-center `}
          >
            {!!showLogins ? <MenuProfileItem /> : <></>}

            <TextIcon
              visibleTopHeader={topHeaderVisible}
              isHome={isHome}
              item={{
                icon: "/assets/icons/header/consultant_header.svg",
                title: _STRINGS.CONSULTANTS,
                route: "/advisors",
                hasBadge: hasBadge,
              }}
            />
            {!!isLogin && !!showLogins ? (
              <div className="relative ">
                <ProfileDropdown isHome={isHeaderLight} notifBadge={notifBadge || 0} />
              </div>
            ) : (
              <></>
            )}
            <TextIcon
              visibleTopHeader={topHeaderVisible}
              isHome={isHome}
              item={{ icon: "/assets/icons/header/adds_header_icon.svg", title: _STRINGS.ADDS, route: "/rooms" }}
            />
            {!!isLogin && !!showLogins ? (
              <div className="relative">
                <AbsoluteBadge count={chaNotifBadge?.unread_count || 0} />
                <TextIcon
                  visibleTopHeader={topHeaderVisible}
                  isHome={isHome}
                  item={{
                    icon: "/assets/icons/header/messages_geader_icon.svg",
                    title: _STRINGS.CHAT,
                    route: "/chat",
                  }}
                />{" "}
              </div>
            ) : (
              <></>
            )}
            <TextIcon
              visibleTopHeader={topHeaderVisible}
              isHome={isHome}
              item={{ title: _STRINGS.ADD_ADD, cb: onCreateAddClick }}
            />
            {/* <Button
              onClick={onCreateAddClick}
              title={_STRINGS.ADD_ADD}
              containerClass="w-fit shrink-0 "
              width="w-full shrink-0"
              roundedClass="rounded-full"
              icon={<img className="ml-2" src="/assets/icons/shared/circular_plus.svg" />}
            /> */}
          </div>
          <div className="hidden md:visible items-center  justify-between lg:flex flex-row  w-2/5">
            <div
              key={`heaeder
            
          `}
              className={` w-full flex gap-4 flex-row justify-end h-full  `}
            >
              <Suspense>
                {!!isHome ? (
                  <></>
                ) : (
                  <>
                    <div className=" hidden md:flex  w-full border  bg-white rounded-full items-center gap-2  pl-4">
                      <Suspense>
                        <PopSearchbox
                          boxId={scroll ? "SEARCH_BOX_Modal" : "SEARCH_BOX"}
                          placeholder={_STRINGS?.SEARCH}
                          onSubmit={() => {}}
                          onClear={() => {
                            // setsearchText("");
                            // router.replace(pathname);
                          }}
                          containerClass={" w-full mx-auto"}
                          item={{ bg: `!bg-transparent  !border-none ` }}
                          // autofocus={isInSearch}
                        />
                      </Suspense>
                      <div className="w-[1px] h-8 bg-gray-300"></div>
                      <HomeCityFilterCityPart />
                    </div>
                    {/* <PopSearchbox
                      boxId={scroll ? "SEARCH_BOX_Modal" : "SEARCH_BOX"}
                      placeholder={_STRINGS?.SEARCH}
                      onSubmit={(text) => {}}
                      onClear={() => {
                        // router.replace(pathname);
                      }}
                      item={{ bg: `!bg-white/70 ${isHome ? "" : "!border"} ` }}
                      autofocus={isInSearch}
                    /> */}
                  </>
                )}
              </Suspense>{" "}
              <Link prefetch={false} href={"/"} className=" w-32  shrink-0 h-10 ">
                {" "}
                <img
                  src="/assets/icons/logo/new_header_logo.svg"
                  alt="jayab"
                  className="w-32  shrink-0 h-10 object-contain   cursor-pointer "
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DrawerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </header>
  );
};

export default React.memo(Header);
