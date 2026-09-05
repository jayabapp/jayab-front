"use client";

import type { GetProfileDto, ProfileMenuEntry } from "@/types/features/user";
import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { useTestAccessMe } from "@features/test-access/hooks/useTestAccessMe";
import { profileItems } from "@/utils/constantss";
import _STRINGS from "@/utils/LocalStrings";
import { isMobile, isTablet } from "react-device-detect";
import { useMemo } from "react";

export const useProfileMenu = (
  profile?: GetProfileDto,
  options?: { includeMobileOnly?: boolean; isLogin?: boolean },
) => {
  const isOwner = !!profile?.owner_id;
  const isAdvisor = !!profile?.advisor_id;
  const { data: activeReserveCount } = useOwnerActiveReservationCount(isOwner);
  const includeMobileOnly =
    options?.includeMobileOnly ?? (isMobile || isTablet);
  const isLogin = options?.isLogin ?? true;
  const { data: testAccess } = useTestAccessMe(isLogin);

  return useMemo<ProfileMenuEntry[]>(() => {
    const roleEntries: ProfileMenuEntry[] = [];

    if (isLogin) {
      roleEntries.push({
        id: "overview",
        imgSrc: "/assets/icons/header/new-face/user.svg",
        route: "/profile",
        title: _STRINGS.PROFILE_OVERVIEW_MENU,
      });
    }

    if (isOwner) {
      roleEntries.push(
        {
          id: "owner-properties",
          imgSrc: "/assets/icons/header/header_my_adds.svg",
          route: "/profile/owner/properties",
          title: "آگهی های من",
        },
        {
          badgeCounter: activeReserveCount ?? undefined,
          id: "owner-reserves",
          imgSrc: "/assets/icons/header/header_my_adds.svg",
          route: "/profile/owner/reserves",
          title: "درخواست های رزرو",
        },
        {
          id: "owner-photo-upgrades",
          imgSrc: "/assets/icons/adds/header_upgrade_image.svg",
          route: "/profile/owner/photo-upgrade-requests",
          title: "درخواست های بهبود تصویر",
        },
      );
    }

    if (isAdvisor) {
      roleEntries.push({
        id: "advisor-subscription",
        imgSrc: "/assets/icons/header/header_my_sub.svg",
        route: "/profile/advisor/subscription",
        title: "بخش مشاور",
      });
    }

    if (isOwner || isAdvisor) {
      roleEntries.push({
        id: "my-payments",
        imgSrc: "/assets/icons/header/header_my_turnovers.svg",
        route: "/profile/my-payments",
        title: "پرداخت های من",
      });
    }

    if (testAccess?.enabled && testAccess.is_team_lead) {
      roleEntries.push({
        id: "test-access",
        imgSrc: "/assets/icons/header/new-face/user.svg",
        route: "/profile/test-access",
        title: "دسترسی محیط تست",
      });
    }

    const platformEntries = includeMobileOnly
      ? profileItems
      : profileItems.filter((entry) => !entry?.isMobile);

    const shared = platformEntries
      .filter((entry) => isLogin || !entry?.guard)
      .map((entry) => ({
        id: entry.id,
        imgSrc: entry.imgSrc,
        route: entry.route,
        title: entry.title,
      }));

    return [...roleEntries, ...shared];
  }, [
    activeReserveCount,
    includeMobileOnly,
    isAdvisor,
    isLogin,
    isOwner,
    testAccess,
  ]);
};
