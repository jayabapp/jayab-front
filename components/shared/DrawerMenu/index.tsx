import { Transition, TransitionChild } from "@headlessui/react";

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import Button from "../Button/Button";

import FormInput from "../Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";

import { isArray } from "lodash";
import Notify from "../Toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { isMobile } from "react-device-detect";
import Link from "next/link";
import { Divider } from "../Divider";

type DrawerMenuType = {
  isOpen: boolean;
  setIsOpen: (e: boolean) => void | null;
};
type drawerMenuContentType = DrawerMenuType & { onSelect: () => void | null };

const DrawerMenu = ({ isOpen, setIsOpen }: DrawerMenuType) => {
  const closeFunc = () => {
    setIsOpen(false);
  };

  return (
    <Transition show={isOpen ? true : false}>
      <div className="z-50 fixed  inset-0">
        <TransitionChild
          enter="transition-opacity  duration-700"
          enterFrom="opacity-0 "
          enterTo="opacity-100 "
          leave="transition-opacity  duration-300"
          leaveFrom="opacity-100 "
          leaveTo="opacity-0 "
        >
          <div onClick={() => closeFunc()} className={"backdrop-grayscale fixed inset-0  z-10"}>
            <div className="bg-neutral-900 bg-opacity-80  w-full  h-full" />
          </div>
        </TransitionChild>
        <TransitionChild
          enter="transition ease-in duration-500 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0 "
          leave="transition ease-out duration-500 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full   "
        >
          <div
            className={`fixed transition-all ease-in-out duration-500 top-0 bottom-0 right-0  h-screen   bg-white dark:bg-zinc-900 w-80 z-20 overflow-scroll`}
          >
            <div className={`w-full  transition-all ease-in-out duration-500 h-full`}>
              <DrawerContent
                onSelect={() => {
                  setIsOpen(false);
                }}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
};

const DrawerContent = ({ onSelect, isOpen, setIsOpen }: drawerMenuContentType) => {
  const router = useRouter();
  let pathname = usePathname();

  const [pathName, setpathName] = useState(pathname);
  const [theme, setTheme] = useState<string | null>("light");

  useEffect(() => {
    const temp = localStorage.getItem("theme-mode");
    setTheme(temp);
  }, []);

  useEffect(() => {
    if (pathname != pathName) onSelect();
  }, [pathname, pathName]);

  if (pathname.includes("profile")) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 relative">
        {pathname != "/" ? (
          <img
            src="/assets/icons/header/home.svg"
            alt="home"
            className="w-6 absolute top-5 left-3 h-auto ml-2 dark:invert"
            onClick={() => {
              router.push("/");
              onSelect();
            }}
          />
        ) : (
          ""
        )}
        <div className="w-full h-40 bg-gradient-to-r from-primary-700/10 to-primary-700/50 flex justify-center items-center transition-all duration-1000 ease-in-out">
          <img
            src="/assets/icons/logo/logo.svg"
            onClick={() => router?.replace("/")}
            alt="bazar_tour"
            className="w-44 h-auto object-contain "
          />
        </div>
        {/* {profileItems.map((e, i) => {
          const selected = pathname.includes(e?.route);
          return (
            <Link
              prefetch={false}
              href={{ pathname: "" }}
              key={e.id}
              onClick={onSelect}
              style={{ textDecoration: "none" }}
            >
              <div
                className={`w-10/12  my-3 py-3 cursor-pointer px-2 flex flex-row  justify-start items-center transition-all duration-200 ease-in-out`}
              >
                <div
                  className={`text-md ml-3 ${
                    selected
                      ? "text-primary-700 font-semibold  dark:text-primary-700"
                      : "text-gray-900 dark:text-neutral-300"
                  }`}
                >
                  {e?.title}
                </div>
              </div>
            </Link>
          );
        })} */}
      </div>
    );
  }

  const isLogin = localStorage.getItem("isLogin");

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900">
      <img
        onClick={() => {
          setIsOpen(false);
        }}
        src="/assets/icons/shared/close.svg"
        className="left-5 top-[1.58rem] w-6 h-6 absolute"
      />

      <div className="w-full h-28 flex-col gap-6 my-8  from-primary-700/10 to-primary-700/50 flex justify-center items-center transition-all duration-1000 ease-in-out">
        <img
          src="/assets/icons/logo/logo.svg"
          onClick={() => router?.replace("/")}
          alt="شاندیز"
          className="w-36 h-auto dark:brightness-200 object-contain"
        />
        <Divider moreClass={"w-[85%]"} />
      </div>

      {/* {headerLinks?.map((e) => (
        <div key={`${e?.id}menuItem`} className="divide-y divide-gray-275 px-5 dark:divide-gray-500 divide-dashed">
          <Link
            className="w-full text-black dark:text-gray-500 py-4 hover:text-primary-700 duration-200 ease-in-out transition-all flex items-center"
            href={e?.link || ""}
          >
            {e?.title}
          </Link>
          <MegaMenuMobile callback={onSelect} />
        </div>
      ))} */}
    </div>
  );
};
export default DrawerMenu;
