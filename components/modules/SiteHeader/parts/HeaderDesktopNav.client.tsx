"use client";

import type { HeaderDesktopNavProps } from "@/types/components/modules/site-header";
import { CountBadge } from "@elements/Badge";

import HeaderSessionBadge from "./HeaderSessionBadge.client";
import HeaderProfileMenu from "./HeaderProfileMenu.client";
import HeaderSearchField from "./HeaderSearchField.client";
import HeaderNavLink from "./HeaderNavLink.client";
import _STRINGS from "@/utils/LocalStrings";
import HeaderBrand from "./HeaderBrand";

const HeaderDesktopNav = ({
  boxId,
  avatar,
  isHome,
  isLight,
  isLogin,
  chatCount,
  advisorHasBadge,
  notificationCount,
  onCreateProperty,
}: HeaderDesktopNavProps) => (
  <>
    <div className="text-xs xl:text-md gap-8 font-medium flex-row hidden xl:flex w-[50%] transition-all ease-in-out duration-1000 items-center">
      <HeaderSessionBadge
        avatar={avatar}
        isLight={isLight}
        isLogin={isLogin}
        notificationCount={notificationCount}
      />

      <HeaderNavLink
        route="/advisors"
        isLight={isLight}
        hasBadge={advisorHasBadge}
        title={_STRINGS.CONSULTANTS}
      />

      {isLogin ? (
        <div className="relative">
          <HeaderProfileMenu
            isLight={isLight}
            notificationCount={notificationCount}
          />
        </div>
      ) : null}

      <HeaderNavLink route="/rooms" isLight={isLight} title={_STRINGS.ADDS} />

      {isLogin ? (
        <div className="relative">
          <CountBadge count={chatCount} />
          <HeaderNavLink
            route="/chat"
            isLight={isLight}
            title={_STRINGS.CHAT}
          />
        </div>
      ) : null}

      <HeaderNavLink
        isLight={isLight}
        title={_STRINGS.ADD_ADD}
        onSelect={onCreateProperty}
      />
    </div>

    <div className="hidden md:visible items-center justify-between xl:flex flex-row w-2/5">
      <div className="w-full flex gap-4 flex-row justify-end h-full">
        {isHome ? null : (
          <HeaderSearchField
            withCitySelector
            boxId={boxId}
            containerClass="hidden md:flex"
            inputClass="!bg-transparent  !border-none "
          />
        )}
        <HeaderBrand asLink isLight={isLight} />
      </div>
    </div>
  </>
);

export default HeaderDesktopNav;
