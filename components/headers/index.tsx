"use client";

import {
  headerMobileSearchBlackList,
  headerWithFullSeach,
} from "@/utils/constantss";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { subscriptionStatus } from "@/helpers/subscriptionStatus";
import { PropertyService } from "@/api_services/property/property.service";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ChatService } from "@/api_services/chat/chat.service";
import { UserService } from "@/api_services/user/user.service";
import { getCookie } from "cookies-next/client";
import { useQuery } from "@tanstack/react-query";

import HomeCityFilterCityPart from "../Home/HomeCityFilterContainer/HomeCityFilterCityPart";
import ProfileDropdown from "./ProfileDropdown";
import AbsoluteBadge from "./AbsoluteBadge";
import HeaderTitle from "./HeaderTitle";
import DrawerMenu from "../shared/DrawerMenu";
import _STRINGS from "@/utils/LocalStrings";
import throttle from "lodash/throttle";
import dynamic from "next/dynamic";
import Button from "../shared/Button/Button";
import Link from "next/link";
import Script from "next/script";

const PopSearchbox = dynamic(() => import("../SearchBoxComp/PopSearchbox"), {
  ssr: true,
});

type textIconType = {
  item: {
    route?: string;
    icon?: string;
    title: string;
    hasBadge?: boolean;
    cb?: () => void | null;
  };
  isHome: boolean;
  visibleTopHeader?: boolean;
};

export const Pulser = ({ className }: { className?: string }) => (
  <div
    className={`w-2 h-2 rounded-full  absolute -left-2 z-1 -top-0.5 bg-red-600 animate-pulse transition-all  ${className}`}
  ></div>
);

const TextIcon = ({ item, isHome, visibleTopHeader }: textIconType) => {
  const parentClass =
    "flex items-center relative transition-all   group  justify-center col-span-1 gap-2 flex-row ";
  const textColor = isHome && visibleTopHeader ? "text-white" : "text-black";
  if (!!item?.route) {
    return (
      <Link
        title={item?.title}
        prefetch={false}
        href={item?.route || ""}
        className={parentClass}
      >
        {item?.hasBadge ? <Pulser /> : <></>}

        <p
          className={`${textColor}  text-sm xl:text-base transition-all  duration-100  shrink-0  font-medium  group-hover:brightness-100 group-hover:text-primary-700  `}
        >
          {item?.title}
        </p>
      </Link>
    );
  } else
    return (
      <div onClick={item?.cb} className={parentClass}>
        {item?.hasBadge ? <Pulser /> : <></>}

        <p
          className={`${textColor} ${visibleTopHeader} shrink-0 text-sm xl:text-base   cursor-pointer ransition-all duration-100 font-medium  group-hover:brightness-100 group-hover:text-primary-700  `}
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
  const { getBackHome, topHeaderVisible, notificationsCount } =
    useStoreParams();
  const [isOpen, setIsOpen] = useState(false);

  const showTopHeader = () => {
    useStoreParams.setState({ topHeaderVisible: true });
  };
  const hideTopHeader = () => {
    useStoreParams.setState({ topHeaderVisible: false });
  };

  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);
    const temp = localStorage.getItem("theme");
    const isLoginTemp = getCookie("isLogin") || localStorage.getItem("isLogin");
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

  const path = pathname;
  const isInSearch = path.includes("products?");
  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const { data: notifBadge } = useQuery({
    queryKey: [UserService.NOTIFS_BADGE_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) return UserService.userNotifBadge();
      else return null;
    },
  });
  useEffect(() => {
    if (!!notifBadge)
      useStoreParams.setState({ notificationsCount: notifBadge });
  }, [notifBadge]);

  const { data: chaNotifBadge } = useQuery({
    queryKey: [ChatService.UNREAD_CHAT_COUNT_CACHEKEY, isLogin, pathname],
    queryFn: () => ChatService.getUnreadChatCount(),
    refetchOnWindowFocus: true,
    enabled: !!isLogin && (pathname == "/" || pathname == "/chat"),
    staleTime: 300,
    gcTime: 300,
  });

  const onCreateAddClick = () => {
    if (!!userInfo) {
      if (!userInfo?.owner_id) {
        router.push(`/profile/edit`);
      } else {
        refetch().then((e) => {
          if (!!e?.data)
            router.push(
              `/profile/owner/properties/${e?.data?.id}/edit/initials`,
            );
        });
      }
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  const registerAdvisor = () => {
    if (isLogin) router.push("/profile/advisor/subscription");
    else useStoreParams.setState({ loginModal: true });
  };

  const removeredirectRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
  };

  const handleBackClick = () => {
    if (window.history.length <= 1) router.push("/");
    else router.back();
  };

  const { data: advisorProfile } = useQuery({
    queryKey: [AdvisorService.USER_ADVISORS_PROFILE_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) return AdvisorService.userAdvisorsProfile();
      else return null;
    },
  });
  const { isActive, remainingDays } = subscriptionStatus(
    advisorProfile?.subscription_expired_at,
  );

  const hasBadge =
    (advisorProfile?.status?.id == 20 && !!isActive && remainingDays <= 3) ||
    (advisorProfile?.status?.id == 20 && !isActive);

  const isHome = pathname == "/" ? true : false;

  const isHeaderLight = isHome && topHeaderVisible;

  const MenuProfileItem = () => {
    return (
      <div className=" flex items-center  gap-3 xl:gap-6  shrink-0 ">
        <Link
          title={_STRINGS.MY_PROFILE}
          href={!!isLogin ? "/profile" : "/auth"}
          prefetch={false}
          className={` ${!!isLogin ? "" : ""} py-1.5 backdrop-blur-[2px] px-2.5 flex items-center gap-3   ${isHeaderLight ? " bg-white/40   border-transparent" : "    "} border  relative shrink-0  transition-all   rounded-full flex items-center justify-center`}
        >
          <img
            src={
              userInfo?.profile_image
                ? NEW_IMAGE_URL(userInfo?.profile_image)
                : "/assets/icons/header/new-face/user.svg"
            }
            className={` ${isLogin && !userInfo?.profile_image ? " xl:brightness-0" : !isLogin && !isHeaderLight ? " brightness-0" : ""} ${isHeaderLight ? "border-white" : "border-gray-500 "} border  shrink-0  size-6  rounded-full transform-gpu transition-all `}
          />
          {!isLogin ? (
            <p
              className={`text-xs pl-1  transition-all  ${!isHeaderLight ? " " : " text-white"}`}
            >
              {_STRINGS.ENTER}
            </p>
          ) : (
            <img
              className={` size-5  pl-1 transition-all ${isHeaderLight ? " invert brightness-200" : ""}`}
              src={"/assets/icons/header/new-face/dots-three-vertical.svg"}
            />
          )}
        </Link>

        {isLogin ? (
          <>
            {" "}
            <Link
              title={"اعلانات"}
              prefetch={false}
              href={"/notifications"}
              className="relative w-5 h-5 transition-all   aspect-square  shrink-0 flex  "
            >
              <AbsoluteBadge count={notificationsCount || 0} />
              <img
                alt="notificatons"
                src="/assets/icons/header/white_bell.svg"
                className={`w-5 h-5 transition-all  aspect-square  transform-gpu shrink-0  ${isHeaderLight ? "" : "invert   opacity-40"} `}
              />
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  };

  return (
    <header className="relative">
      <Script
        id="mediaad-retargeting"
        src="https://s1.mediaad.org/serve/118386/retargeting.js"
        strategy="lazyOnload"
      />
      <div
        id="headerContainer"
        className={`
     ${isHome && topHeaderVisible ? "  bg-gradient-to-b     from-black/40 to-black/0  md:pb-24    " : topHeaderVisible ? "" : "   "}
transition-all ease-out  duration-300  header-content-container w-full mx-auto dark:bg-dark-900`}
      >
        {/* ROW 1 */}
        <div
          className={`flex justify-between  transition-all items-center  xl:gap-[10%]    duration-300  padding-x  py-2 xl:py-4   ${isHeaderLight ? "    bg-transparent " : topHeaderVisible ? "   bg-white   " : `   bg-white    ${headerWithFullSeach.includes(pathname) || !!params?.slug ? " border-b  xl:border-b-0  xl:shadow-lg" : "shadow-lg"}  `} `}
        >
          <div className=" xl:hidden flex w-full  ">
            {isHome ? (
              <div className="w-full flex items-center  py-1  rounded-full justify-between pl-2 pr-1.5 gap-3 xl:gap-6">
                <MenuProfileItem />

                <div className="flex items-center gap-3 xl:gap-6 w-full justify-end">
                  <div
                    className={` ${topHeaderVisible ? "hidden" : "  flex"} transition-all   w-full `}
                  >
                    <Suspense>
                      <PopSearchbox
                        onClear={() => {}}
                        onSubmit={() => {}}
                        autofocus={isInSearch}
                        item={{ bg: `  !py-0.5 ` }}
                        placeholder={_STRINGS?.SEARCH}
                        containerClass={" w-full mx-auto"}
                        boxId={
                          scroll
                            ? "SEARCH_BOX_Mobile_Modal"
                            : "SEARCH_BOX_Mobile"
                        }
                      />
                    </Suspense>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 justify-center">
                    <img
                      className={`w-16 ${topHeaderVisible && !!isHome ? "flex  grayscale brightness-[500]" : "hidden  xl:flex"} `}
                      src="/assets/icons/logo/just_title_logo.svg"
                    />
                    <img
                      className="w-10 h-10 aspect-square  shrink-0 "
                      src="/assets/icons/logo/header_mobile_logo.svg"
                    />
                  </div>
                </div>
              </div>
            ) : (headerWithFullSeach.includes(pathname) &&
                !room_slug &&
                !slug) ||
              (!!slug && !room_slug) ? (
              <div className="flex items-center w-full justify-between  gap-4">
                <div className=" flex  w-full border  bg-white rounded-full items-center gap-2  pl-4">
                  <Suspense>
                    <PopSearchbox
                      boxId={
                        scroll ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"
                      }
                      onClear={() => {}}
                      onSubmit={() => {}}
                      autofocus={isInSearch}
                      placeholder={_STRINGS?.SEARCH}
                      containerClass={" w-full mx-auto"}
                      item={{ bg: `!bg-transparent  !border-none ` }}
                    />
                  </Suspense>
                  <div className="w-[1px] h-8 bg-gray-300"></div>
                  <HomeCityFilterCityPart />
                </div>
              </div>
            ) : (
              <div className="flex items-center w-full justify-between  gap-4">
                <div
                  onClick={() => {
                    if (!!getBackHome && (!!room_slug || !!chat_id)) {
                      removeredirectRoomToHome();
                      router.push("/");
                    } else if (
                      pathname == "/profile/orders" ||
                      (!!slug && !room_slug)
                    ) {
                      router.push("/");
                    } else {
                      handleBackClick();
                    }
                  }}
                  className="cursor-pointer w-12 h-4      "
                >
                  <img
                    src="/assets/icons/shared/chevron-right.svg"
                    className="     "
                  />
                </div>
                <p className="font-bold text-base text-center">
                  <HeaderTitle />
                </p>
                <div className="  w-12 h-10   flex items-center justify-center">
                  {" "}
                  <div className="cursor-pointer  absolute left-4     ">
                    {pathname == "/advisors" ? (
                      !userInfo?.advisor_id ? (
                        <Button
                          onClick={registerAdvisor}
                          roundedClass="rounded-full"
                          title={_STRINGS.REGISTER_ADVISOR}
                          width=" !px-3  !text-sm !py-1 w-fit "
                          containerClass="w-fit !px-0.5  items-center justify-center"
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
                        title="خانه"
                      >
                        <img
                          src="/assets/icons/navbar/home_nav.svg"
                          className="transition-all   grayscale opacity-50  hover:opacity-100 hover:grayscale-0"
                        />
                      </Link>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {headerMobileSearchBlackList.find((e) =>
                          pathname?.includes(e),
                        ) ? (
                          <></>
                        ) : pathname.includes("/rooms/") ? (
                          <Link
                            onClick={() => {
                              // removeLocalBackHomeFunc();
                            }}
                            className="w-5 h-5 aspect-square"
                            href={"/"}
                            title={"back"}
                          >
                            <img
                              src="/assets/icons/navbar/home_nav_black.svg"
                              className="transition-all  grayscale opacity-60  hover:opacity-100 hover:grayscale-0"
                            />
                          </Link>
                        ) : (
                          <Suspense>
                            <PopSearchbox
                              justIcon
                              item={{ bg: "" }}
                              onClear={() => {}}
                              onSubmit={() => {}}
                              autofocus={isInSearch}
                              placeholder={_STRINGS?.SEARCH}
                              boxId={
                                scroll
                                  ? "SEARCH_BOX_Mobile_Modal"
                                  : "SEARCH_BOX_Mobile"
                              }
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
            className={` text-xs   xl:text-md   gap-8 font-medium flex-row hidden xl:flex w-[50%] transition-all  ease-in-out duration-1000 items-center `}
          >
            <MenuProfileItem />

            <TextIcon
              isHome={isHome}
              visibleTopHeader={topHeaderVisible}
              item={{
                icon: "/assets/icons/header/consultant_header.svg",
                title: _STRINGS.CONSULTANTS,
                route: "/advisors",
                hasBadge: hasBadge,
              }}
            />
            {!!isLogin ? (
              <div className="relative ">
                <ProfileDropdown
                  isHome={isHeaderLight}
                  notifBadge={notificationsCount || 0}
                />
              </div>
            ) : (
              <></>
            )}
            <TextIcon
              visibleTopHeader={topHeaderVisible}
              isHome={isHome}
              item={{
                icon: "/assets/icons/header/adds_header_icon.svg",
                title: _STRINGS.ADDS,
                route: "/rooms",
              }}
            />
            {!!isLogin ? (
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
          </div>
          <div className="hidden md:visible items-center  justify-between xl:flex flex-row  w-2/5">
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
                          onClear={() => {}}
                          containerClass={" w-full mx-auto"}
                          item={{ bg: `!bg-transparent  !border-none ` }}
                        />
                      </Suspense>
                      <div className="w-[1px] h-8 bg-gray-300"></div>
                      <HomeCityFilterCityPart />
                    </div>
                  </>
                )}
              </Suspense>{" "}
              <Link
                prefetch={false}
                title={_STRINGS.JAYAB}
                href={"/"}
                className=" flex items-center gap-1.5    shrink-0 h-10 "
              >
                {" "}
                <div className="flex items-center shrink-0 gap-1 justify-center">
                  <img
                    className={`w-16 ${topHeaderVisible && !!isHome ? "flex  grayscale brightness-[500]" : "hidden  xl:flex"} `}
                    src="/assets/icons/logo/just_title_logo.svg"
                  />
                  <img
                    className="w-10 h-10 aspect-square shrink-0"
                    src="/assets/icons/logo/header_mobile_logo.svg"
                  />
                </div>
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
