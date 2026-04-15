import { Menu, MenuButton, Transition } from "@headlessui/react";

import { usePathname, useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";

import ConfirmModal from "../Modal/ConfirmModal";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { profileDropDownItems } from "@/utils/constantss";
import AbsoluteBadge from "./AbsoluteBadge";

const ProfileDropdown = ({ notifBadge, isHome }: { notifBadge?: number | string; isHome?: boolean }) => {
  const { userInfo } = useStoreInit((data) => data);
  const { isAdvisor } = useStoreParams((data) => data);
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

    router.push("/");
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
    <div className="text-right ">
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
        className="relative  group inline-block text-left"
      >
        <div>
          <MenuButton
            ref={ref}
            className={`flex items-center transition-all      justify-center col-span-1 gap-2 flex-row `}
          >
            {/* <img src="/assets/icons/navbar/my_jayab.svg" className="dark:invert" /> */}
            <p
              className={`  ${isHome ? "text-white" : " text-black "}  shrink-0 font-medium   group-hover:text-primary-700 `}
            >
              {_STRINGS.MY_PROFILE}
            </p>
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
          <div className="absolute left-0  z-[60]  mt-2 w-48 origin-top-center  rounded-xl bg-white dark:bg-zinc-800 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none  overflow-scroll">
            <div className="px-1 py-2 ">
              <Link key={`safasfsafq`} className="" prefetch={false} href={`/notifications`}>
                <div
                  className={` relative hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                >
                  <div className="relative">
                    {" "}
                    <AbsoluteBadge count={Number(notifBadge) || 0} />
                    <img
                      src={`/assets/icons/header/prof_dropdownn_bell.svg`}
                      className={`w-6 h-6 aspect-square ${asPath.includes("notifications") ? " " : ""} dark:invert `}
                    />
                  </div>
                  <p className="text-sm"> {_STRINGS.MY_NOTIFS}</p>
                </div>
              </Link>

              {!!userInfo?.owner_id ? (
                <Link key={`myAdd2s`} className="" prefetch={false} href={`/profile/owner/properties`}>
                  <div
                    className={` relative hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                  >
                    <div className="relative">
                      {" "}
                      <img
                        src={`/assets/icons/header/header_my_adds.svg`}
                        className={`w-6 h-6 aspect-square ${asPath.includes("notifications") ? " " : ""} dark:invert `}
                      />
                    </div>
                    <p className="text-sm"> {"آگهی های من"}</p>
                  </div>
                </Link>
              ) : (
                <></>
              )}
              {!!userInfo?.owner_id ? (
                <Link key={`myAdd2s`} className="" prefetch={false} href={`/profile/owner/reserves`}>
                  <div
                    className={` relative hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                  >
                    <div className="relative">
                      {" "}
                      <img
                        src={`/assets/icons/header/header_my_adds.svg`}
                        className={`w-6 h-6 aspect-square ${asPath.includes("notifications") ? " " : ""} dark:invert `}
                      />
                    </div>
                    <p className="text-sm"> {"درخواست های رزرو"}</p>
                  </div>
                </Link>
              ) : (
                <></>
              )}

              {!!userInfo?.advisor_id ? (
                <Link key={`myAdds52`} className="" prefetch={false} href={`/profile/advisor/subscription`}>
                  <div
                    className={` relative hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                  >
                    <div className="relative">
                      {" "}
                      <img
                        src={`/assets/icons/header/header_my_sub.svg`}
                        className={`w-6 h-6 aspect-square ${
                          asPath.includes("/profile/advisor/subscription") ? " " : ""
                        } dark:invert `}
                      />
                    </div>
                    <p className="text-sm"> {"بخش مشاور"}</p>
                  </div>
                </Link>
              ) : (
                <></>
              )}
              {profileDropDownItems.map((e) => (
                <Link key={`${e.id}pItem`} prefetch={false} href={e?.route}>
                  <div
                    key={e.id}
                    className={`hover:bg-primary-700/80 dark:hover:bg-zinc-600  cursor-pointer hover:text-white text-gray-600 dark:text-gray-300 group flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline`}
                  >
                    <img
                      src={e?.imgSrc}
                      className={`w-6 h-6 aspect-square ${asPath.includes(e?.route) ? " " : ""} dark:invert `}
                    />
                    <p className="text-sm"> {e?.title}</p>
                  </div>
                </Link>
              ))}
              <button
                className={` text-red-500
                     group flex w-full px-2    items-center rounded-md  gap-2 py-2 text-sm font-medium`}
                onClick={() => setisVisible(true)}
              >
                <img src={"/assets/icons/header/header_logout.svg"} className={`w-6 h-6 aspect-square dark:invert `} />{" "}
                {_STRINGS.LOGOUT_TITLE}
              </button>
            </div>
          </div>
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
