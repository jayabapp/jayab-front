import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";

import { usePathname, useRouter } from "next/navigation";
import React, { Fragment, useRef, useState } from "react";

import ConfirmModal from "../Modal/ConfirmModal";

import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import Link from "next/link";
import _STRINGS from "@/utils/LocalStrings";

import { useAuthStore, useStoreInit } from "@/store";
import { profileDropDownItems } from "@/utils/constantss";

const ProfileDropdown = ({}) => {
  const asPath = usePathname();
  const ref = useRef<HTMLButtonElement>(null);
  const [isVisible, setisVisible] = useState(false);
  const router = useRouter();

  const logoutProcess = () => {
    localStorage.removeItem("access_token");

    localStorage.removeItem("isLogin");
    localStorage.removeItem("is_registered");
    useAuthStore.setState({ isLogin: false });
    useStoreInit.setState({ userInfo: null });

    // router.push("/auth");
  };

  const _logout = () => {
    logoutProcess();

    // dispatch({
    //   type: "IS_LOGIN",
    //   payload: false,
    // });
    // dispatch({
    //   type: "USER_INFO",
    //   payload: null,
    // });
    // router.replace("/");
    // setisVisible(false);
  };

  return (
    <div className="text-right">
      {isVisible && (
        <ConfirmModal
          text={_STRINGS.LOG_OUT_MESSAGE}
          isVisible={true}
          isLoading={false}
          title={_STRINGS.LOGGING_OUT}
          onHide={() => setisVisible(false)}
          confirmText={_STRINGS.YES}
          hideText={_STRINGS.NO}
          onConfirm={_logout}
        />
      )}
      <Menu
        onMouseEnter={() => {
          if (ref?.current) {
            ref?.current.click();
          }
        }}
        onMouseLeave={() => {
          if (ref?.current) {
            ref?.current.click();
          }
        }}
        as="div"
        className="relative inline-block text-left"
      >
        <div>
          <MenuButton
            ref={ref}
            className={`flex items-center transition-all  brightness-125 hover:brightness-100 hover:grayscale-0  grayscale justify-center col-span-1 gap-2 flex-wrap ml-6`}
          >
            <img src="/assets/icons/navbar/my_jayab.svg" className="dark:invert" />
            <p className="text-primary-700">{_STRINGS.MY_PROFILE}</p>
          </MenuButton>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute left-0  z-20  mt-2 w-48 origin-top-center  rounded-xl bg-white dark:bg-zinc-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-scroll">
            <div className="px-1 py-2 ">
              {profileDropDownItems.map((e) => (
                <MenuItem key={e.id}>
                  <Link prefetch={false} href={e?.route}>
                    <div
                      className={`hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                    >
                      <img
                        src={e?.imgSrc}
                        className={`w-6 h-6 aspect-square ${asPath.includes(e?.route) ? " " : ""} dark:invert `}
                      />
                      <p> {e?.title}</p>
                    </div>
                  </Link>
                </MenuItem>
              ))}
              <MenuItem>
                <button
                  className={` text-red-500
                     group flex w-full justify-between items-center rounded-md px-2 py-2 text-sm font-light`}
                  onClick={() => setisVisible(true)}
                >
                  <img
                    src={"/assets/icons/header/header_logout.svg"}
                    className={`w-6 h-6 aspect-square dark:invert `}
                  />{" "}
                  {_STRINGS.LOGOUT_TITLE}
                </button>
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default ProfileDropdown;

/*  
<Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <div className="absolute z-20 top-6 right-0 mt-2 w-full origin-top-center  rounded-md bg-white dark:bg-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none max-h-64 overflow-scroll">
            <div className="py-1 divide-y divide-gray-250 dark:divide-gray-500">
              {options.map((e, i) => {
                return (
                  <div key={e.id}>
                    <button
                      className='text-gray-700 dark:text-gray-300 hover:bg-primary-700 hover:text-white flex w-full items-center  px-2 py-3' 
                      onClick={(v) => {
                        onSelect(e);
                        setIsOpen(false);
                      }}>
                      {e.title}
                      <img src={e.icon} alt='' className='w-4 h-4 object-contain' />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Transition>
*/
