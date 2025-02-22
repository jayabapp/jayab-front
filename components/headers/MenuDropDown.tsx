import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";

import { usePathname } from "next/navigation";
import React, { Fragment, useRef } from "react";

import Link from "next/link";
import _STRINGS from "@/utils/LocalStrings";

import { menuDropDownItems } from "@/utils/constantss";

const MenuDropDown = ({}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const asPath = usePathname();

  return (
    <div className="text-right mt-1">
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
            className={`flex items-center transition-all  brightness-125 hover:brightness-100 hover:grayscale-0  grayscale justify-center col-span-1 gap-2 flex-row ml-6`}
          >
            <img src="/assets/icons/header/menu_header.svg" className="dark:invert" />
            <p className="text-primary-700 shrink-0 text-sm  ">{_STRINGS.MENU}</p>
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
              {menuDropDownItems.map((e) => (
                <MenuItem key={e.id}>
                  <Link prefetch={false} href={e?.route}>
                    <div
                      className={`hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                    >
                      <img
                        src={e?.imgSrc}
                        className={`w-6 h-6 aspect-square ${asPath.includes(e?.route) ? " " : ""} dark:invert `}
                      />
                      <p className="text-sm"> {e?.title}</p>
                    </div>
                  </Link>
                </MenuItem>
              ))}
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
};

export default MenuDropDown;
