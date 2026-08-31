"use client";

import type { HeaderMobileBarProps } from "@/types/components/modules/site-header";
import { useParams, usePathname, useRouter } from "next/navigation";
import { headerMobileSearchBlackList } from "@/utils/constantss";
import { headerWithFullSeach } from "@/utils/constantss";
import { ContentImage } from "@elements/Image";
import { useStoreParams } from "@/store";

import HeaderSessionBadge from "./HeaderSessionBadge.client";
import HeaderSearchField from "./HeaderSearchField.client";
import HeaderRouteTitle from "./HeaderRouteTitle.client";
import _STRINGS from "@/utils/LocalStrings";
import HeaderBrand from "./HeaderBrand";
import Button from "@elements/Button";
import Link from "next/link";

const HeaderMobileBar = ({
  boxId,
  avatar,
  isHome,
  isLight,
  isLogin,
  isAdvisor,
  notificationCount,
  onRegisterAdvisor,
}: HeaderMobileBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { chat_id, room_slug, slug } = useParams();
  const { getBackHome, topHeaderVisible } = useStoreParams((state) => state);

  const leaveRoomToHome = () => {
    useStoreParams.setState({ getBackHome: false });
    router.push("/");
  };

  const onBack = () => {
    if (getBackHome && (room_slug || chat_id)) return leaveRoomToHome();
    if (pathname === "/profile/orders" || (slug && !room_slug))
      return router.push("/");
    if (window.history.length <= 1) return router.push("/");
    router.back();
  };

  if (isHome)
    return (
      <div className="xl:hidden flex w-full">
        <div className="w-full flex items-center py-1 rounded-full justify-between pl-2 pr-1.5 gap-3 xl:gap-6">
          <HeaderSessionBadge
            avatar={avatar}
            isLight={isLight}
            isLogin={isLogin}
            notificationCount={notificationCount}
          />

          <div className="flex items-center gap-3 xl:gap-6 w-full justify-end">
            <div
              className={`${topHeaderVisible ? "hidden" : "flex"} transition-all w-full`}
            >
              <HeaderSearchField
                boxId={boxId}
                inputClass="  !py-0.5 "
                containerClass=" w-full mx-auto"
              />
            </div>
            <HeaderBrand isLight={isLight} />
          </div>
        </div>
      </div>
    );

  const showsFullSearch =
    (headerWithFullSeach.includes(pathname) && !room_slug && !slug) ||
    (!!slug && !room_slug);

  if (showsFullSearch)
    return (
      <div className="xl:hidden flex w-full">
        <div className="flex items-center w-full justify-between gap-4">
          <HeaderSearchField
            withCitySelector
            boxId={boxId}
            inputClass="!bg-transparent  !border-none "
          />
        </div>
      </div>
    );

  return (
    <div className="xl:hidden flex w-full">
      <div className="flex items-center w-full justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          title={_STRINGS.BACK}
          className="cursor-pointer w-12 h-4"
        >
          <ContentImage
            alt=""
            width={16}
            height={16}
            src="/assets/icons/shared/chevron-right.svg"
          />
        </button>

        <p className="font-bold text-base text-center">
          <HeaderRouteTitle />
        </p>

        <div className="w-12 h-10 flex items-center justify-center">
          <div className="cursor-pointer absolute left-4">
            {pathname === "/advisors" ? (
              isAdvisor ? null : (
                <Button
                  onClick={onRegisterAdvisor}
                  roundedClass="rounded-full"
                  title={_STRINGS.REGISTER_ADVISOR}
                  width=" !px-3  !text-sm !py-1 w-fit "
                  containerClass="w-fit !px-0.5  items-center justify-center"
                />
              )
            ) : pathname.includes("/profile") ? (
              <Link
                href="/"
                title={_STRINGS.HOME}
                onClick={() => useStoreParams.setState({ getBackHome: false })}
              >
                <ContentImage
                  alt=""
                  width={28}
                  height={28}
                  src="/assets/icons/navbar/home_nav.svg"
                  className="transition-all grayscale opacity-50 hover:opacity-100 hover:grayscale-0"
                />
              </Link>
            ) : (
              <div className="flex gap-2 items-center">
                {headerMobileSearchBlackList.find((route) =>
                  pathname?.includes(route),
                ) ? null : pathname.includes("/rooms/") ? (
                  <Link
                    href="/"
                    title={_STRINGS.HOME}
                    className="w-5 h-5 aspect-square"
                  >
                    <ContentImage
                      alt=""
                      width={20}
                      height={20}
                      src="/assets/icons/navbar/home_nav_black.svg"
                      className="transition-all grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                    />
                  </Link>
                ) : (
                  <HeaderSearchField justIcon boxId={boxId} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobileBar;
