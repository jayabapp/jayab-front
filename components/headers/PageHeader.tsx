"use client";
import React from "react";

import { usePathname, useRouter } from "next/navigation";
// import _STRINGS from "@/utils/LocalStrings";
// import { useQuery } from "@tanstack/react-query";
// import { UserService } from "@/api_services/user/user.service";

const PageHeaders = ({
  title,
  containerClass = "",
  disableBack = false,
  customeBackRoute,
  customeBackFunc,
  disableBell,
}: {
  title: string;
  containerClass?: string;
  disableBack?: boolean;
  disableBell?: boolean;
  customeBackRoute?: string;
  customeBackFunc?: () => void | null;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // const { chatNotification } = useSelector((state: any) => state?.params);

  const isVendor = pathname.includes("/vendor");

  const pusher = (link: string) => {
    router.push(link);
  };

  // const onNotifClick = () => {
  //   if (isVendor) {
  //     pusher(`/vendor/notifications`);
  //   } else {
  //     pusher(`/customer/notifications`);
  //   }
  // };

  // const { data } = useQuery([UserService.BADGE_COUNT_CACHEKEY, isVendor], () => {
  //   return UserService.GetBadge({ type: isVendor ? "vendor" : "customer" });
  // });

  return (
    <div
      className={` fixed  select-none z-[40]     bg-white w-full transition-all top-0 left-0 h-16 px-6 flex items-center justify-between py-4`}
    >
      <div
        // onClick={() => {
        //   if (!disableBack) {
        //     if (customeBackFunc) {
        //       customeBackFunc();
        //     } else if (customeBackRoute) {
        //       router.push(customeBackRoute);
        //     } else {
        //       router.back();
        //     }
        //   }
        // }}
        className="w-fit   select-none cursor-pointer justify-center gap-2 flex items-center"
      >
        {disableBack ? (
          <></>
        ) : (
          <svg
            className="mt-0.5 cursor-pointer"
            onClick={() => {
              if (customeBackRoute) {
                router.push(customeBackRoute);
              } else {
                router.back();
              }
            }}
            width="18"
            height="24"
            viewBox="0 0 18 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 11.939C16 12.3208 15.854 12.6465 15.5508 12.9385L6.79102 21.5073C6.55518 21.7544 6.24072 21.8779 5.88135 21.8779C5.15137 21.8779 4.57861 21.3164 4.57861 20.5752C4.57861 20.2158 4.72461 19.8901 4.97168 19.6431L12.8667 11.939L4.97168 4.23486C4.72461 3.97656 4.57861 3.65088 4.57861 3.2915C4.57861 2.56152 5.15137 2 5.88135 2C6.24072 2 6.55518 2.12354 6.79102 2.37061L15.5508 10.9395C15.854 11.2314 15.9888 11.5571 16 11.939Z"
              fill="#1E1E1E"
            />
          </svg>
        )}{" "}
        {/* <p className="text-xs ">{_STRINGS?.A36}</p> */}
      </div>
      <p className="font-bold text-base">{title}</p>
      <div className="w-5 h-5"> </div>
      {/* {disableBell ? (
      ) : (
        <div onClick={onNotifClick} className="relative cursor-pointer">
          {data ? (
            <div className="rounded-full flex items-center justify-center absolute w-4 h-4 -right-2 -top-2  text-xs  text-white bg-red-700">
              {data}
            </div>
          ) : (
            <></>
          )}
          <img src={"/assets/icons/header/bell.svg"} className="w-5 h-5 aspect-square" />
        </div>
      )} */}
    </div>
  );
};

export default PageHeaders;
