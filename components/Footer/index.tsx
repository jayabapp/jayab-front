"use client";
import { useRouter, usePathname } from "next/navigation";
import { Fragment, JSX, useEffect, useState } from "react";
import { isIOS } from "react-device-detect";
import _STRINGS from "../../utils/LocalStrings";
import { useStoreInit, useStoreParams, useStoreTheme } from "@/store";
import { PropertyService } from "@/api_services/property/property.service";
import { useQuery } from "@tanstack/react-query";
interface reduxType {
  auth: { [key: string]: string };
}

type footerItem = {
  id: number;
  title?: string;
  route: string;
  onClick?: () => void | null;

  icon: string;
};

type footerItems = footerItem[];

const Footer: React.FC = ({}) => {
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
          title: _STRINGS.ADD,
          route: "/adds",

      icon: "/assets/icons/navbar/adds_footer.svg",
    },
    {
      id: 14242,
      title: _STRINGS.CREATE_ADD,
      route: "/owner/properties",
      callBack: () => {
        if (!!userInfo) {
          if (!userInfo?.owner_id) {
            router.push(`/profile/edit`);
          } else {
            refetch().then((e) => {
              if (!!e?.data) router.push(`/owner/properties/${e?.data?.id}/edit/initials`);
            });
          }
        }
      },

          icon: "/assets/icons/navbar/add_footer.svg",
      },
      {
          id: 142142,
          title: _STRINGS.CONSULTAMCY,
          route: "/consultants",

          icon: "/assets/icons/navbar/footer_consultancy.svg",
      },
      {
          id: 1442,
          title: _STRINGS.MY_PROFILE,
          route: "/profile",

          icon: "/assets/icons/navbar/my_jayab.svg",
      },
      // {
      //   id: 51,
      //   title: _STRINGS.HISTORY,
      //   route: "/reserve-history",

      //   icon: <ReservesHistoryIcon fill={color} />,
      // },
      // {
      //   id: 3,
      //   title: _STRINGS.ADD_QUEUE,
      //   route: "/add-reserve",

      //   icon: <RoundCubicalPlusIcon fill={color} />,
      // },
      // {
      //   id: 51,
      //   title: _STRINGS.FINANCIALS,
      //   route: "/financials",

      //   icon: <CoinSackIcon fill={color} />,
      // },
      // {
      //   id: 1,
      //   title: _STRINGS.MENU,
      //   route: "/menu",
      //   icon: <BurgerMenu fill={color} />,
      // },
  ];
  const [focused, setFocused] = useState(footerItems?.find((i) => i?.route === route));

  const isFocused = (key: string) => {
    return route === `${key}`;
  };
  return (
    <div
      // style={{ maxWidth: "900px", right: 0 }}
      className={`z-1  flex   max-w-[800px]  ${
        isIOS ? "pb-8" : "pb-5"
      }  pt-3 md:py-3   justify-between  md:rounded-md  left-0  right-0     mx-auto   shadow-card transition-all duration-1000	ease-in-out  items-center fixed bottom-0 w-full   bg-white  `}
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
                    !isFocused(el?.route) && el?.title ? " !font-light  " : "!font-medium     "
                  }   truncate text-sm  md:text-base  text-primary-700 select-none
            
                `}
                >
                  {el?.title}
                </p>
              ) : (
                <></>
              )}

              {/* <div className={`absolute `} /> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
