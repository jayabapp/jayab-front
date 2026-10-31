"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { headerMobileSearchBlackList } from "@/utils/constantss";
import { headerWithFullSeach } from "@/utils/constantss";
import { DisplayPreferences } from "@modules/DisplayPreferences";
import { useTranslations } from "next-intl";
import { HomeHeroSearch } from "@modules/HomeHeroSearch";
import { useStoreParams } from "@/store";
import { Icon } from "@elements/Icon";
import { useDir } from "@hooks/useDir";

import HeaderSessionBadge from "./HeaderSessionBadge.client";
import HeaderSearchField from "./HeaderSearchField.client";
import HeaderRouteTitle from "./HeaderRouteTitle.client";
import HeaderBrand from "./HeaderBrand";
import Button from "@elements/Button";
import Link from "next/link";

import type { HeaderMobileBarProps } from "@/types/components/modules/site-header";

const HeaderMobileBar = ({
  boxId,
  phone,
  avatar,
  isHome,
  isLight,
  isLogin,
  isAdvisor,
  notificationCount,
  onRegisterAdvisor,
}: HeaderMobileBarProps) => {
  const t = useTranslations();
  const dir = useDir();
  const router = useRouter();
  const pathname = usePathname();
  const { chat_id, room_slug, slug } = useParams();
  const { getBackHome, homeSearchInView, topHeaderVisible } = useStoreParams(
    (state) => state,
  );

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
      <div className="flex w-full min-w-0 xl:hidden">
        <div className="flex w-full min-w-0 items-center gap-2 py-1">
          <HeaderSessionBadge
            compact
            phone={phone}
            avatar={avatar}
            isLight={isLight}
            isLogin={isLogin}
            notificationCount={notificationCount}
          />

          {topHeaderVisible || homeSearchInView ? (
            <div className="ms-auto flex min-w-0 items-center justify-end">
              <HeaderBrand isLight={isLight} />
            </div>
          ) : (
            <>
              <div dir={dir} className="min-w-0 flex-1">
                <HomeHeroSearch isPhone variant="header" />
              </div>
              <HeaderBrand asLink markOnly isLight={false} />
            </>
          )}
        </div>
      </div>
    );

  const showsFullSearch =
    (headerWithFullSeach.includes(pathname) && !room_slug && !slug) ||
    (!!slug && !room_slug);

  if (showsFullSearch)
    return (
      <div className="xl:hidden flex w-full">
        <div className="flex min-w-0 items-center w-full justify-between gap-2">
          <HeaderSearchField
            boxId={boxId}
            withCitySelector
            inputClass="!bg-transparent  !border-none "
          />
          <DisplayPreferences compact />
        </div>
      </div>
    );

  return (
    <div className="xl:hidden flex w-full">
      <div className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          title={t("common.back")}
          className="flex size-11 items-center justify-start"
        >
          <Icon name="chevron-start" size={16} />
        </button>

        <p
          dir={dir}
          className="min-w-0 truncate font-bold text-base text-center"
        >
          <HeaderRouteTitle />
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <DisplayPreferences compact />
          <div className="flex min-h-11 shrink-0 items-center justify-center">
            {pathname === "/advisors" ? (
              isAdvisor ? null : (
                <Button
                  onClick={onRegisterAdvisor}
                  roundedClass="rounded-full"
                  title={t("header.registerAdvisor")}
                  width=" !px-3  !text-sm !py-1 w-fit "
                  containerClass="w-fit !px-0.5  items-center justify-center"
                />
              )
            ) : pathname.includes("/profile") ? (
              <Link
                href="/"
                title={t("common.home")}
                onClick={() => useStoreParams.setState({ getBackHome: false })}
                className="flex size-8 items-center justify-center text-ink-muted hover:text-ink"
              >
                <Icon name="home" size={24} />
              </Link>
            ) : (
              <div className="flex gap-2 items-center">
                {headerMobileSearchBlackList.find((route) =>
                  pathname?.includes(route),
                ) ? null : pathname.includes("/rooms/") ? (
                  <Link
                    href="/"
                    title={t("common.home")}
                    className="flex size-8 items-center justify-center text-ink-muted hover:text-ink"
                  >
                    <Icon name="home" size={24} />
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
