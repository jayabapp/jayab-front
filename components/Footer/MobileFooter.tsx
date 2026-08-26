"use client";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { ChatService } from "@/api_services/chat/chat.service";
import { PropertyService } from "@/api_services/property/property.service";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { footerHiddenBlackList } from "@/utils/constantss";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { throttle } from "lodash";
import moment from "moment-jalaali";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isIOS } from "react-device-detect";
import _STRINGS from "../../utils/LocalStrings";

export const Pulser = () => (
  <div className="w-2 h-2 rounded-full  absolute left-2 z-1 -top-0.5 bg-red-600 animate-pulse transition-all"></div>
);

const MobileFooter: React.FC = ({}) => {
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);
  const router = useRouter();
  const { isLogin } = useAuthStore((state: any) => state);
  const route = usePathname();
  const { owmerActiveReservesCount } = useStoreParams((data) => data);
  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const rightFooterItems = [
    {
      id: 2,
      title: _STRINGS.HOME,
      route: "/",

      icon: "/assets/icons/navbar/home_nav.svg",
    },
    {
      id: 142142,
      title: _STRINGS.CONSULTAMCY,
      route: "/advisors",

      icon: "/assets/icons/navbar/footer_consultancy.svg",
    },
  ];
  const lefttFooterItems = [
    {
      id: 242,
      title: _STRINGS.CHAT,
      route: "/chat",

      icon: "/assets/icons/navbar/footer_chat.svg",
      notif: true,
    },

    {
      id: 1442,
      title: _STRINGS.MY_PROFILE,
      route: "/profile",

      icon: "/assets/icons/navbar/my_jayab_v2.svg",
    },
  ];

  const isFocused = (key: string) => {
    return route === `${key}`;
  };

  function getPWADisplayMode(): "twa" | "standalone" | "browser" {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
    if (document.referrer.startsWith("android-app://")) {
      return "twa";
    } else if (isStandalone) {
      return "standalone";
    }
    return "browser";
  }

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
  /*                            ON CREATE POST CLICK                            */
  /* -------------------------------------------------------------------------- */

  const onCreatePost = () => {
    useStoreParams.setState({ sideBarStatus: false });

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

  /* -------------------------------------------------------------------------- */
  /*                              FOOTER ANIMATION                              */
  /* -------------------------------------------------------------------------- */
  var lastScrollTop = 0;
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = throttle((event) => {
    var st = window?.scrollY || document?.documentElement?.scrollTop;
    if (st > lastScrollTop) {
      if (st - lastScrollTop > 20) {
        setIsVisible(false);
      }
    } else if (st < lastScrollTop) {
      if (lastScrollTop - st > 20) setIsVisible(true);
    }
    lastScrollTop = st <= 0 ? 0 : st;
  }, 100);
  useEffect(() => {
    window?.addEventListener("scroll", handleScroll);

    return () => window?.removeEventListener("scroll", handleScroll);
  }, []);

  const MY_JAYAB_HAS_NOTIF = !!owmerActiveReservesCount;

  /* -------------------------------------------------------------------------- */
  /*                                 CHAT BADGE                                 */
  /* -------------------------------------------------------------------------- */

  const { data: chaNotifBadge } = useQuery({
    queryKey: [ChatService.UNREAD_CHAT_COUNT_CACHEKEY, isLogin, pathname],
    queryFn: () => ChatService.getUnreadChatCount(),

    refetchOnWindowFocus: true,
    enabled: !!isLogin && (pathname == "/" || pathname == "/chat"),
    staleTime: 300,
    gcTime: 300,
  });

  const CHAT_HAS_NOTIF = !!chaNotifBadge?.unread_count;
  return (
    <AnimatePresence mode="sync">
      {!!isVisible && !footerHiddenBlackList.find((e) => route?.includes(e)) ? (
        <motion.div
          key="mobile-footer"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 140, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          style={{
            filter: `drop-shadow(0px -4px 30px #030E2525)`,
          }}
          className={`    z-10     flex   max-w-[800px]  ${
            isIOS && getPWADisplayMode() == "standalone" ? "pb-8" : "pb-6"
          }  flex lg:hidden  pt-3 justify-between  !touch-none md:rounded-md  left-0  right-0       mx-auto     items-center fixed bottom-0 w-full   bg-white  `}
        >
          <div className="flex w-full items-center   justify-around px-3     ">
            {rightFooterItems?.map((el, i) => {
              return (
                <div
                  className={` w-full   relative cursor-pointer select-none flex flex-col items-center gap-1 justify-center transition-all duration-1000	ease-in-out  `}
                  onClick={() => {
                    if (!isFocused(el?.route)) {
                      router.push(`${el?.route}`);
                    }
                  }}
                  key={el?.id}
                >
                  {!!hasBadge && el?.route == "/advisors" && !isFocused(el?.route) ? (
                    <div className="w-2 h-2 rounded-full  absolute left-2 z-1 -top-0.5 bg-red-600 animate-pulse transition-all"></div>
                  ) : (
                    <></>
                  )}

                  <img
                    alt={`${el?.id}footerItem`}
                    src={el?.icon}
                    className={` w-6  ${
                      !isFocused(el?.route) && el?.title ? " opacity-60 grayscale brightness-90  " : " "
                    }  h-6 aspect-square object-contain`}
                  />

                  {el?.title ? (
                    <p
                      className={`  ${
                        !isFocused(el?.route) && el?.title ? " opacity-60 grayscale brightness-90  " : " "
                      }   truncate text-xs  md:text-base  text-primary-700 select-none
            
                `}
                    >
                      {el?.title}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
            {/* CENTER */}
            <div onClick={onCreatePost} className={`  flex flex-col justify-between   shrink-0   w-24     relative  `}>
              <img className=" -bottom-[2.1rem] h-24  absolute w-24 " src="/assets/icons/navbar/footer_bump.svg" />
              <div className=" w-full h-full  aspect-square  absolute -top-[1.85rem] left-0 right-0 mx-auto rounded-full  bg-transparent flex items-center justify-center ">
                <div className="footer-plus-shadow  flex items-center justify-center  size-[3.250rem] rounded-full border border-primary-1200 ">
                  <img className="size-[0.875rem]" src="/assets/icons/navbar/footer_big_plus.svg" />
                </div>
              </div>

              <p className=" truncate text-xs  absolute -bottom-[1.375rem] right-0 left-0 mx-auto md:text-base  text-center text-primary-700 select-none opacity-60 grayscale brightness-90  ">
                {_STRINGS.CREATE_ADD}
              </p>
            </div>

            {/* LEFT PART  */}
            {lefttFooterItems?.map((el, i) => {
              return (
                <div
                  className={` w-full   relative cursor-pointer select-none flex flex-col items-center gap-1 justify-center transition-all duration-1000	ease-in-out  `}
                  onClick={() => {
                    if (!isFocused(el?.route)) {
                      useStoreParams.setState({ sideBarStatus: false });

                      router.push(`${el?.route}`);
                    }
                  }}
                  key={el?.id}
                >
                  {((!!MY_JAYAB_HAS_NOTIF && el?.route == "/profile") || (!!CHAT_HAS_NOTIF && el?.route == "/chat")) &&
                  !isFocused(el?.route) ? (
                    <Pulser />
                  ) : (
                    <></>
                  )}

                  <img
                    alt={`${el?.id}footerItem`}
                    src={el?.icon}
                    className={` w-6  ${
                      !isFocused(el?.route) && el?.title ? " opacity-60 grayscale brightness-90  " : " "
                    }  h-6 aspect-square object-contain`}
                  />

                  {el?.title ? (
                    <p
                      className={`  ${
                        !isFocused(el?.route) && el?.title ? " opacity-60 grayscale brightness-90  " : " "
                      }   truncate text-xs  md:text-base  text-primary-700 select-none
            
                `}
                    >
                      {el?.title}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <></>
      )}
    </AnimatePresence>
  );
};

export default MobileFooter;
