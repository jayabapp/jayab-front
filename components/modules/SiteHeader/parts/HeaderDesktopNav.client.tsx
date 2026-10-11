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

  const navBlock = (
    <div className="hidden shrink-0 items-center gap-4 text-xs font-medium xl:flex xl:text-md 2xl:gap-6">
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
  );

  const search = isHome ? null : (
    <HeaderSearchField
      boxId={boxId}
      withCitySelector
      containerClass="hidden min-w-0 max-w-md md:flex"
      inputClass="!bg-transparent !border-none"
    />
  );

  const brandBlock = (
    <div className="hidden min-w-0 flex-1 items-center xl:flex">
      <div className="flex h-full w-full items-center justify-end gap-4">
        {search}
        <HeaderBrand asLink isLight={isLight} />
      </div>
    </div>
  );

  return (
    <>
      {navBlock}
      {brandBlock}
    </>
  );
};

export default HeaderDesktopNav;
