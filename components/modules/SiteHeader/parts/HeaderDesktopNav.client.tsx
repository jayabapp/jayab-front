"use client";

import { useTranslations } from "next-intl";
import { CountBadge } from "@elements/Badge";

import HeaderSessionBadge from "./HeaderSessionBadge.client";
import HeaderProfileMenu from "./HeaderProfileMenu.client";
import HeaderSearchField from "./HeaderSearchField.client";
import HeaderNavLink from "./HeaderNavLink.client";
import HeaderBrand from "./HeaderBrand";

import type { HeaderDesktopNavProps } from "@/types/components/modules/site-header";

const HeaderDesktopNav = ({
  boxId,
  avatar,
  phone,
  isHome,
  isLight,
  isLogin,
  chatCount,
  advisorHasBadge,
  notificationCount,
  onCreateProperty,
}: HeaderDesktopNavProps) => {
  const t = useTranslations();

  return (
    <>
      <div className="text-xs xl:text-md gap-8 font-medium flex-row hidden xl:flex w-[50%] transition-all ease-in-out duration-1000 items-center">
        <HeaderSessionBadge
          phone={phone}
          avatar={avatar}
          isLight={isLight}
          isLogin={isLogin}
          notificationCount={notificationCount}
        />

        <HeaderNavLink
          route="/advisors"
          isLight={isLight}
          hasBadge={advisorHasBadge}
          title={t("header.advisors")}
        />

        {isLogin ? (
          <div className="relative">
            <HeaderProfileMenu
              isLight={isLight}
              notificationCount={notificationCount}
            />
          </div>
        ) : null}

        <HeaderNavLink
          route="/rooms"
          isLight={isLight}
          title={t("header.listings")}
        />

        {isLogin ? (
          <div className="relative">
            <CountBadge count={chatCount} />
            <HeaderNavLink
              route="/chat"
              isLight={isLight}
              title={t("common.chat")}
            />
          </div>
        ) : null}

        <HeaderNavLink
          isLight={isLight}
          title={t("header.addListing")}
          onSelect={onCreateProperty}
        />
      </div>

      <div className="hidden md:visible items-center justify-between xl:flex flex-row w-2/5">
        <div className="w-full flex gap-4 flex-row justify-end h-full">
          {isHome ? null : (
            <HeaderSearchField
              boxId={boxId}
              withCitySelector
              containerClass="hidden md:flex"
              inputClass="!bg-transparent !border-none"
            />
          )}
          <HeaderBrand asLink isLight={isLight} />
        </div>
      </div>
    </>
  );
};

export default HeaderDesktopNav;
