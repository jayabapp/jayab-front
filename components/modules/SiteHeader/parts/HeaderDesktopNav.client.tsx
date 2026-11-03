"use client";

import { useTranslations } from "next-intl";
import { useStoreParams } from "@/store";
import { CountBadge } from "@elements/Badge";

import HeaderSessionBadge from "./HeaderSessionBadge.client";
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
  const { topHeaderVisible } = useStoreParams((state) => state);

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

  // On the landing page the hero already has the search box. Once the sheet scrolls over it (header
  // no longer sits on the hero), the header takes over so search stays one click away.
  const search =
    isHome && topHeaderVisible ? null : (
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
