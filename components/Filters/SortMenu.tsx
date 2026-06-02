import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import queryBuilder from "@/helpers/queryBuilder";
import { useStoreInit } from "@/store";
import { SORT_TYPES } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { Menu, MenuButton, Transition } from "@headlessui/react";

export interface SortMenuType {
  query?: any;
}

const SortMenu = ({ query }: SortMenuType) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((state) => state);
  const [sortTypes, setSortTypes] = useState(SORT_TYPES);

  useEffect(() => {
    if (!userInfo?.advisor_id) {
      setSortTypes(SORT_TYPES?.filter((e) => e?.id != "commission_desc"));
    } else {
      setSortTypes(SORT_TYPES);
    }
  }, [userInfo]);

  // const [selectedCat, setSelectedCat] = useState<{ title: string; id: number } | null>(null);

  // const { data: storeData } = useQuery([BusinessServices.SINGLE_BUSINESSES_CACHEKEY, storeId], () =>
  //   BusinessServices.GetSingleBusiness({ id: storeId })
  // );

  const setTag = (id: string | number | null | undefined) => {
    let temp = { ...query };
    delete temp.page;
    if (id == null) {
      delete temp.sort_type;

      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,
        })}`,
      );
    } else {
      router.replace(
        `${pathname}?${queryBuilder({
          ...temp,

          sort_type: id,
        })}`,
      );
    }
  };

  return (
    <div className="w-fit flex lg:flex-row  shrink-0 gap-3 items-center justify-between rounded-10 dark:border-zinc-600 ">
      <Menu as="div" className="relative  shrink-0 inline-block text-left mr-1">
        <div>
          <MenuButton className="  md:h-6.5  shrink-0 rounded-lg cursor-pointer flex justify-between items-center">
            <div className="  gap-2  h-6.5 px-2  shrink-0 rounded-full bg-white border-primary-400 border  flex items-center justify-center  ">
              {" "}
              <p className=" shrink-0 text-xs md:text-sm">
                {" "}
                {sortTypes?.find((e) => e?.id == query?.sort_type)?.title || SORT_TYPES?.[0]?.title}
              </p>{" "}
              <img className="w-3 h-3 aspect-square" src="/assets/icons/shared/chevron.svg" />
            </div>
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
          <div className="absolute  shadow-xl top-0 md:top-auto left-0 z-20  mt-2 w-48 origin-top-center  rounded-20 bg-white dark:bg-zinc-800 custom-shadow ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-scroll">
            <div className="flex gap-2 px-3 items-center flex-col  py-2 border-b border-gray-275 dark:border-zinc-500 ">
              <div className=" w-full flex items-center justify-between  py-1">
                <p className="text-sm">{_STRINGS.SORT_BY}</p>
                <img src={"/assets/icons/adds/x_mark.svg"} className=" w-2.5 h-2.5   " />
              </div>

              {sortTypes.map((e, index) => (
                <button
                  key={e.id}
                  className={`w-full pl-8  py-2 border-t first:border-t-0 pt-2 gap-2 flex items-center cursor-pointer relative`}
                  onClick={() => {
                    if (query?.sort_type == e?.id) {
                      // setTag(null);
                    } else setTag(e?.id);
                  }}
                >
                  {query?.sort_type == e?.id || (!query?.sort_type && index == 0) ? (
                    <img className="absolute left-2 " src="/assets/icons/adds/blue_tick.svg" />
                  ) : (
                    <></>
                  )}
                  <img src={e?.icon} className=" w-5 h-5 aspect-square" />
                  <p className="text-sm text-black dark:text-zinc-300 opacity-70"> {e?.title}</p>
                </button>
              ))}
            </div>
          </div>
        </Transition>
      </Menu>
    </div>
  );
};

export default SortMenu;
