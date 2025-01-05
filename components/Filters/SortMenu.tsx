import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, Fragment, useState } from "react";

import Button from "../shared/Button/Button";

import { Menu, MenuButton, Transition } from "@headlessui/react";
import queryBuilder from "@/helpers/queryBuilder";
import { useQuery } from "@tanstack/react-query";
import { SORT_TYPES } from "@/utils/constantss";

type sortTypeType = { id?: string; title?: string };
export interface SortMenuType {
  query?: any;
}

const SortMenu = ({ query }: SortMenuType) => {
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCat, setSelectedCat] = useState<{ title: string; id: number } | null>(null);

  // const { data: storeData } = useQuery([BusinessServices.SINGLE_BUSINESSES_CACHEKEY, storeId], () =>
  //   BusinessServices.GetSingleBusiness({ id: storeId })
  // );

  const setTag = (id: string | number | null) => {
    let temp = { ...query };

    if (id == null) {
      delete temp.sort_type;
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,
        })}`
      );
    } else {
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,

          sort_type: id,
        })}`
      );
    }
  };

  return (
    <div className="w-fit flex lg:flex-row  gap-3 items-center justify-between rounded-10 dark:border-zinc-600 ">
      <Menu as="div" className="relative inline-block text-left mr-1">
        <div>
          <MenuButton className=" h-auto md:h-11 rounded-lg cursor-pointer flex justify-between items-center">
            <Button
              endIcon={
                <img src="/assets/icons/forms/chevron-down.svg" alt={"arrow_head"} className=" w-3 h-3 aspect-square" />
              }
              width="!px-4 !text-sm md:!text-base md:custome-shadow-card !w-full !gap-2"
              title={SORT_TYPES?.find((e) => e?.id == query?.sort_type)?.title}
            />
            {/* <div className="flex bg-white border py-2 px-4 rounded-md items-center gap-2">
              <p className="text-primary-700 font-medium text-sm">
                {SORT_TYPES?.find((e) => e?.id == query?.sort_type)?.title}
              </p>
     
            </div> */}
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
          <Menu.Items className="absolute top-0 md:top-auto left-0 z-20  mt-2 w-40 origin-top-center  rounded-xl bg-white dark:bg-zinc-800 custom-shadow ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-scroll">
            <div className="flex gap-2 items-center flex-col px-1 py-2 border-b border-gray-275 dark:border-zinc-500 ">
              {" "}
              {SORT_TYPES.map((e) => (
                <Menu.Item key={e.id}>
                  <div
                    className={`w-full pl-8  cursor-pointer relative`}
                    onClick={() => {
                      if (query?.sort_type == e?.id) {
                        // setTag(null);
                      } else setTag(e?.id);
                    }}
                  >
                    {query?.sort_type == e?.id ? (
                      <img className="absolute left-2 w- top-1/4" src="/assets/icons/shared/tick.svg" />
                    ) : (
                      <></>
                    )}
                    <p className="text-sm text-black dark:text-zinc-300 opacity-70"> {e?.title}</p>
                  </div>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SortMenu;
