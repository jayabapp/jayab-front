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
import { headerMobileSearchBlackList } from "@/utils/constantss";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useQuery } from "@tanstack/react-query";
import { throttle } from "lodash";
import moment from "moment-jalaali";
import Button from "../shared/Button/Button";
import DrawerMenu from "../shared/DrawerMenu";
import AbsoluteBadge from "./AbsoluteBadge";
import HeaderTitle from "./HeaderTitle";
import MenuDropDown from "./MenuDropDown";
import ProfileDropdown from "./ProfileDropdown";
const PopSearchbox = dynamic(() => import("../SearchBoxComp/PopSearchbox"), {
  ssr: true,
});

type textIconType = {
  item: { route?: string; icon?: string; title: string; hasBadge?: boolean; cb?: () => void | null };
  isHome: boolean;
};

const Pulser = ({ className }: { className?: string }) => (
  <div
    className={`w-2 h-2 rounded-full  absolute -left-2 z-1 -top-0.5 bg-red-600 animate-pulse transition-all ${className}`}
  ></div>
);

const TextIcon = ({ item, isHome }: textIconType) => {
  const parentClass = "flex items-center relative transition-all  group  justify-center col-span-1 gap-2 flex-row ";
  const textColor = isHome ? "text-white" : "text-black";
  if (!!item?.route) {
    return (
      <Link prefetch={false} href={item?.route || ""} className={parentClass}>
        {item?.hasBadge ? <Pulser /> : <></>}

        {/* <img
      src={item?.icon}
      className={`dark:invert  brightness-125 group-hover:brightness-100 group-hover:grayscale-0  grayscale `}
    /> */}
        <p className={`${textColor}  shrink-0  font-medium  group-hover:brightness-100 group-hover:text-primary-700  `}>
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
        <p className={`${textColor}  shrink-0  font-medium  group-hover:brightness-100 group-hover:text-primary-700  `}>
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
  const { getBackHome } = useStoreParams((state: any) => state);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogins, setShowLogins] = useState(false);
  const [visibleTopHeader, setVisibleTopHeader] = useState(true);
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
    if (window?.scrollY > 20) setVisibleTopHeader(false);
    else setVisibleTopHeader(true);
  }, 100);

  useEffect(() => {
    if (scroll) {
      if (scroll > 20) setVisibleTopHeader(false);
      else setVisibleTopHeader(true);
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
  return (
    <header className="relative">
      <div
        id="headerContainer"
        className={`
     ${visibleTopHeader && isHome ? "  pb-24 from-black/40  " : " from-white/60 backdrop-blur-md    "}

transition-all  bg-gradient-to-b  to-black/0   ease-in-out duration-1000 header-content-container w-full mx-auto     dark:bg-dark-900   py-4 `}
      >
        {/* ROW 1 */}
        <div className="flex justify-between  items-center  xl:gap-[10%]  py-1  padding-x  ">
          <div className=" lg:hidden flex w-full  ">
            {pathname == "/" ? (
              <div className="w-full flex items-center  bg-primary-100  py-1  rounded-full justify-between pl-2 pr-1.5 gap-2">
                <div className="flex items-center gap-4">
                  <div className=" flex items-center justify-center gap-2">
                    {" "}
                    <Link
                      prefetch={false}
                      href={"/profile"}
                      className="w-[2.875rem]   aspect-square h-[2.875rem] !outline-none "
                    >
                      <img
                        src={
                          userInfo?.profile_image
                            ? NEW_IMAGE_URL(userInfo?.profile_image)
                            : "/assets/icons/logo/mobile_header_logo.svg"
                        }
                        alt="jayab"
                        className=" w-[2.875rem]   aspect-square h-[2.875rem] rounded-full  object-cover !outline-none cursor-pointer "
                        // onClick={() => pusher("/")}
                      />
                    </Link>
                    <div className="flex flex-col gap-0">
                      <p className="font-bold text-lg  text-primary-700  line-clamp-1">
                        {userInfo?.full_name ? userInfo?.full_name : _STRINGS.LOGO}
                      </p>
                      <p className="text-xs text-primary-800 ">{userInfo?.mobile_number}</p>
                    </div>
                  </div>
                </div>

                {showLogins ? (
                  isLogin ? (
                    <>
                      {" "}
                      <div className="flex items-center py-2 px-4 gap-6">
                        <Link prefetch={false} href={"/chat"} className="relative">
                          <AbsoluteBadge count={chaNotifBadge?.unread_count || 0} />
                          <img alt="chat" src="/assets/icons/header/blue_chat.svg" className="w-6 h-6 aspect-square" />
                        </Link>
                        <Link prefetch={false} href={"/notifications"} className="relative">
                          <AbsoluteBadge count={notifBadge || 0} />
                          <img
                            alt="notificatons"
                            src="/assets/icons/header/blue_bell.svg"
                            className="w-6 h-6 aspect-square"
                          />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <Link prefetch={false} href={"/auth"} className="relative">
                      {" "}
                      <Button
                        title={`${_STRINGS.ENTER}/${_STRINGS.REGISTER}`}
                        containerClass="w-fit"
                        width="w-full"
                        roundedClass="rounded-full"
                        icon={<img className="ml-2" alt="circular_plus" src="/assets/icons/shared/circular_plus.svg" />}
                      />
                    </Link>
                  )
                ) : (
                  <></>
                )}
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
                  className="cursor-pointer w-12 h-6      "
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
                            {/* <PopSearchbox
                              justIcon
                              boxId={scroll ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"}
                              placeholder={_STRINGS?.SEARCH_CITY_OR_ADD}
                              onSubmit={(text) => {}}
                              onClear={() => {}}
                              item={{ bg: "" }}
                              autofocus={isInSearch}
                            /> */}
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
            {!!showLogins ? (
              <div
                className={` flex items-center transition-all   rounded-full ${isHome ? "border-white bg-white/40 " : " border-primary-700 bg-primary-700/40 "}  transition-all  border   p-1 pr-3  brightness-125 hover:brightness-100  justify-center col-span-1 gap-3 flex-row`}
              >
                <MenuDropDown isHome={isHome} />
                {isLogin ? (
                  <div
                    className={` border ${isHome ? "border-white" : "border-primary-700"}  transition-all   rounded-full flex items-center justify-center`}
                  >
                    <img src="/assets/icons/header/new-face/user.svg" />
                  </div>
                ) : (
                  <div className="lg:flex shrink-0 hidden items-center gap-2 pl-2">
                    <TextIcon
                      isHome={isHome}
                      item={{
                        icon: "/assets/icons/header/adds_header_icon.svg",
                        title: `${_STRINGS?.ENTER} / ${_STRINGS?.REGISTER}`,
                        route: "/auth",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}

            <TextIcon
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
                <ProfileDropdown isHome={isHome} notifBadge={notifBadge || 0} />
              </div>
            ) : (
              <></>
            )}
            <TextIcon
              isHome={isHome}
              item={{ icon: "/assets/icons/header/adds_header_icon.svg", title: _STRINGS.ADDS, route: "/rooms" }}
            />
            {!!isLogin && !!showLogins ? (
              <div className="relative">
                <AbsoluteBadge count={chaNotifBadge?.unread_count || 0} />
                <TextIcon
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
            <TextIcon isHome={isHome} item={{ title: _STRINGS.ADD_ADD, cb: onCreateAddClick }} />
            {/* <Button
              onClick={onCreateAddClick}
              title={_STRINGS.ADD_ADD}
              containerClass="w-fit shrink-0 "
              width="w-full shrink-0"
              roundedClass="rounded-full"
              icon={<img className="ml-2" src="/assets/icons/shared/circular_plus.svg" />}
            /> */}
          </div>
          <div className="hidden md:visible items-center w-auto md:w-fit  justify-between lg:flex flex-row ">
            <div
              key={`heaeder
            
          `}
              className={` w-full flex flex-col justify-between h-full  `}
            >
              {" "}
              <Link prefetch={false} href={"/"} className="w-full  ">
                {" "}
                <img
                  src="/assets/icons/logo/new_header_logo.svg"
                  alt="jayab"
                  className="w-full  h-auto object-contain  mr-2 md:mr-0 cursor-pointer "
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
