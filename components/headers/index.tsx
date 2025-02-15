"use client";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { throttle } from "lodash";
import dynamic from "next/dynamic";
import Link from "next/link";

import _STRINGS from "@/utils/LocalStrings";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import HeaderTitle from "./HeaderTitle";
import DrawerMenu from "../shared/DrawerMenu";
import ProfileDropdown from "./ProfileDropdown";
import MenuDropDown from "./MenuDropDown";
import Button from "../shared/Button/Button";
import AbsoluteBadge from "./AbsoluteBadge";
import { headerBlackList, headerMobileBlackList } from "@/utils/constantss";
import { PropertyService } from "@/api_services/property/property.service";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/api_services/user/user.service";
import { ChatService } from "@/api_services/chat/chat.service";
import { NEW_IMAGE_URL } from "@/utils/urls";
const PopSearchbox = dynamic(() => import("../SearchBoxComp/PopSearchbox"), {
  ssr: false,
});

type textIconType = {
  item: { route: string; icon: string; title: string };
};

const TextIcon = ({ item }: textIconType) => (
  <Link
    prefetch={false}
    href={item?.route}
    className={`flex items-center transition-all  brightness-125 hover:brightness-100 hover:grayscale-0  grayscale justify-center col-span-1 gap-2 flex-row ml-4 `}
  >
    <img src={item?.icon} className="dark:invert" />
    <p className="text-primary-700 shrink-0">{item?.title}</p>
  </Link>
);

const Header = ({ scroll }: { scroll?: number }) => {
  const { userInfo } = useStoreInit((data) => data);
  const router = useRouter();
  const pathname = usePathname();
  const params: any = useSearchParams();
  const { isLogin } = useAuthStore((state: any) => state);
  const searchTextInparam = params.get("q");
  const utm_source = params.get("utm_source");

  const [visibleTopHeader, setVisibleTopHeader] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [searchText, setsearchText] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);
    const temp = localStorage.getItem("theme");
    const isLoginTemp = localStorage.getItem("isLogin");
    useAuthStore.setState({ isLogin: isLoginTemp === "true" ? true : false });

    if (temp) {
      setTheme(temp);
    }
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

  useEffect(() => {
    if (!searchTextInparam) {
      setsearchText(null);
    }
  }, [searchTextInparam]);

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
    queryKey: [UserService.NOTIFS_BADGE_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) {
        return UserService.userNotifBadge();
      } else {
        return null;
      }
    },
  });
  const { data: chaNotifBadge } = useQuery({
    queryKey: [ChatService.UNREAD_CHAT_COUNT_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) {
        return ChatService.getUnreadChatCount();
      } else return null;
    },
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

  return (
    <div className="relative">
      <div
        id="headerContainer"
        className={`
      ${headerMobileBlackList.find((e) => pathname.includes(e)) && " hidden md:block"}

transition-all  ease-in-out duration-1000 header-content-container w-full mx-auto custome-shadow-card  backdrop-blur-md  bg-white dark:bg-dark-900   pt-2 pb-2   border-b dark:border-zinc-500 border-gray-100 `}
      >
        {/* ROW 1 */}
        <div className="flex justify-between  items-center  xl:gap-[10%]  py-1  px-3 md:px-10  2xl:px-[9%]  ">
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
                      <p className="font-bold text-lg  text-primary-700 ">
                        {userInfo?.full_name ? userInfo?.full_name : _STRINGS.LOGO}
                      </p>
                      <p className="text-xs text-primary-800 ">{userInfo?.mobile_number}</p>
                    </div>
                  </div>
                </div>

                {isLogin ? (
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
                      icon={<img className="ml-2" src="/assets/icons/shared/circular_plus.svg" />}
                    />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center w-full justify-between  gap-4">
                {" "}
                <img
                  src="/assets/icons/shared/chevron-right.svg"
                  onClick={(e) => {
                    if (utm_source == "true") {
                      router.push("/");
                    } else if (pathname == "/profile/orders") {
                      router.push("/");
                    } else {
                      router.back();
                    }
                  }}
                  className="cursor-pointer w-12 h-6      "
                  // src="/assets/icons/addresses/garbage.svg"
                />
                <p className="font-bold text-base text-center">{HeaderTitle()}</p>
                <div className="  w-12 h-10   flex items-center justify-center">
                  {" "}
                  <div className="cursor-pointer  absolute left-4     ">
                    {/**************     IN ADVISORS PAGE  WE NEED ADVISOR CREATE BUTTON  ***************/}

                    {pathname == "/advisors" ? (
                      !userInfo?.advisor_id ? (
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
                      <Link href={"/"}>
                        <img
                          src="/assets/icons/navbar/home_nav.svg"
                          className="transition-all grayscale opacity-50  hover:opacity-100 hover:grayscale-0"
                        />
                      </Link>
                    ) : (
                      <div className="flex gap-2 items-center">
                        {pathname.includes("/rooms/") ? (
                          <Link className="w-5 h-5 aspect-square" href={"/"}>
                            <img
                              src="/assets/icons/navbar/home_nav_black.svg"
                              className="transition-all grayscale opacity-60  hover:opacity-100 hover:grayscale-0"
                            />
                          </Link>
                        ) : (
                          <PopSearchbox
                            justIcon
                            boxId={scroll ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"}
                            placeholder={_STRINGS?.SEARCH_CITY_OR_ADD}
                            onSubmit={(text) => setsearchText(text)}
                            onClear={() => {
                              setsearchText("");
                            }}
                            item={{ bg: "" }}
                            autofocus={isInSearch}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="hidden md:visible items-center w-auto md:w-1/2  justify-between lg:flex flex-row ">
            <div
              key={`heaeder
            
          `}
              className={` w-fit flex flex-col justify-between h-fit  `}
            >
              {" "}
              <Link prefetch={false} href={"/"} className="w-fit  ">
                {" "}
                <img
                  src="/assets/icons/logo/header_logo.svg"
                  alt="bazar_tour"
                  className="w-fit  h-auto object-contain ml-2 md:ml-2 mr-2 md:mr-0 cursor-pointer "
                />
              </Link>
            </div>
            <div className="w-3/4">
              <PopSearchbox
                boxId={scroll ? "SEARCH_BOX_Modal" : "SEARCH_BOX"}
                placeholder={_STRINGS?.SEARCH_CITY_OR_ADD}
                onSubmit={(text) => setsearchText(text)}
                onClear={() => {
                  setsearchText("");
                  // router.replace(pathname);
                }}
                item={{ bg: `!bg-white/70 ${pathname == "/" ? "" : "!border"} ` }}
                autofocus={isInSearch}
              />
            </div>
          </div>
          <div
            className={` text-xs gap-2  lg:text-md  justify-between font-medium flex-row hidden lg:flex w-[60%] transition-all ease-in-out duration-1000 items-center `}
          >
            {!!isLogin ? (
              <TextIcon
                item={{
                  icon: "/assets/icons/header/messages_geader_icon.svg",
                  title: _STRINGS.MESSAGES,
                  route: "/chat",
                }}
              />
            ) : (
              // <div className="lg:flex shrink-0 hidden items-center gap-2">
              //   <Link prefetch={false} href={"/auth"} className="shrink-0 transition-all hover:text-primary-700">
              //     {_STRINGS?.ENTER} / {_STRINGS?.REGISTER}
              //   </Link>
              // </div>
              <></>
            )}
            <TextIcon
              item={{ icon: "/assets/icons/header/adds_header_icon.svg", title: _STRINGS.ADDS, route: "/rooms" }}
            />
            <TextIcon
              item={{
                icon: "/assets/icons/header/consultant_header.svg",
                title: _STRINGS.CONSULTANTS,
                route: "/advisors",
              }}
            />
            {!!isLogin ? (
              <>
                <ProfileDropdown notifBadge={notifBadge || 0} />
              </>
            ) : (
              <></>
            )}
            <MenuDropDown />

            {!!isLogin ? (
              <></>
            ) : (
              <div className="lg:flex shrink-0 hidden items-center gap-2">
                <Link prefetch={false} href={"/auth"} className="shrink-0 transition-all hover:text-primary-700">
                  <Button
                    onClick={() => {}}
                    title={`${_STRINGS?.ENTER} / ${_STRINGS?.REGISTER}`}
                    containerClass="w-fit shrink-0 "
                    width="w-full shrink-0"
                    roundedClass="rounded-full"
                    variant="outline"
                  />
                </Link>
              </div>
            )}

            <Button
              onClick={onCreateAddClick}
              title={_STRINGS.ADD_ADD}
              containerClass="w-fit shrink-0 "
              width="w-full shrink-0"
              roundedClass="rounded-full"
              icon={<img className="ml-2" src="/assets/icons/shared/circular_plus.svg" />}
            />
          </div>
        </div>
      </div>

      <DrawerMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default React.memo(Header);
