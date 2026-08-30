"use client";

import type { GetProfileDto, ProfileMenuEntry } from "@/types/features/user";
import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { profileItems } from "@/utils/constantss";
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

  return useMemo<ProfileMenuEntry[]>(() => {
    const roleEntries: ProfileMenuEntry[] = [];

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
  }, [activeReserveCount, includeMobileOnly, isAdvisor, isLogin, isOwner]);
};
