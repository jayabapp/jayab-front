"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { isIOS } from "react-device-detect";
import _STRINGS from "../../utils/LocalStrings";
import { useStoreInit, useStoreParams, useStoreTheme } from "@/store";
import { PropertyService } from "@/api_services/property/property.service";
import { useQuery } from "@tanstack/react-query";

const MobileFooter: React.FC = ({}) => {
  const { userInfo } = useStoreInit((data) => data);
  const router = useRouter();

  const route = usePathname();

  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const footerItems = [
    {
      id: 2,
      title: _STRINGS.HOME,
      route: "/",

      icon: "/assets/icons/navbar/home_nav.svg",
    },
    {
      id: 242,
      title: _STRINGS.ADDS,
      route: "/rooms",

      icon: "/assets/icons/navbar/adds_footer.svg",
    },
    {
      id: 14242,
      title: _STRINGS.CREATE_ADD,
      route: "/profile/owner/properties",
      callBack: () => {
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
      },

      icon: "/assets/icons/navbar/add_footer.svg",
    },
    {
      id: 142142,
      title: _STRINGS.CONSULTAMCY,
      route: "/advisors",

      icon: "/assets/icons/navbar/footer_consultancy.svg",
    },
    {
      id: 1442,
      title: _STRINGS.MY_PROFILE,
      route: "/profile",

      icon: "/assets/icons/navbar/my_jayab.svg",
    },
  ];
  const [focused, setFocused] = useState(footerItems?.find((i) => i?.route === route));

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
  return (
    <div
      className={`z-1    flex   max-w-[800px]  ${
        isIOS && getPWADisplayMode() == "standalone" ? "pb-8" : "pb-5"
      }  flex lg:hidden  pt-3 justify-between  md:rounded-md  left-0  right-0     mx-auto   shadow-card transition-all duration-1000	ease-in-out  items-center fixed bottom-0 w-full   bg-white  `}
    >
      <div className="flex w-full items-center   justify-around px-4     md:gap-6">
        {footerItems?.map((el, i) => {
          return (
            <div
              className={` w-[15%] ${
                !isFocused(el?.route) && el?.title ? " opacity-60 grayscale brightness-90  " : " "
              }   cursor-pointer select-none flex flex-col items-center gap-1 justify-center transition-all duration-1000	ease-in-out  `}
              onClick={() => {
                if (!isFocused(el?.route)) {
                  useStoreParams.setState({ sideBarStatus: false });
                  if (!!el?.callBack) {
                    el?.callBack();
                  } else {
                    router.push(`${el?.route}`);
                    setFocused(el);
                  }
                }
              }}
              key={el?.id}
            >
              <img
                alt={`${el?.id}footerItem`}
                src={el?.icon}
                className={` w-5 h-5 aspect-square object-contain ${isFocused(el?.route) && el?.title ? "" : " "}`}
              />

              {el?.title ? (
                <p
                  className={`  ${
                    !isFocused(el?.route) && el?.title ? "  " : "     "
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
    </div>
  );
};

export default MobileFooter;
