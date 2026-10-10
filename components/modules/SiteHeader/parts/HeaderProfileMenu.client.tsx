"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useOwnerActiveReservationCount } from "@features/reservations/hooks/useOwnerActiveReservationCount";
import { useMemo, useRef, useState } from "react";
import { profileDropDownItems } from "@/utils/constantss";
import { CountBadge, PulseDot } from "@elements/Badge";
import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useLogout } from "@features/auth/hooks/useLogout";

import type { HeaderProfileMenuProps } from "@/types/components/modules/site-header";
import type { ProfileMenuEntry } from "@/types/features/user";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import Link from "next/link";

const ROW_CLASS =
  "relative text-neutral-600 flex w-full gap-2 items-center rounded-md px-2 py-2 text-sm font-light no-underline hover:bg-brand-600/80 hover:text-white data-[focus]:bg-brand-600/80 data-[focus]:text-white";

const HeaderProfileMenu = ({
  isLight,
  notificationCount,
}: HeaderProfileMenuProps) => {
  const t = useTranslations();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const logout = useLogout();

  const { data: profile } = useCurrentProfile();
  const isOwner = !!profile?.owner_id;
  const { data: activeReserves } = useOwnerActiveReservationCount(isOwner);

  const entries = useMemo<ProfileMenuEntry[]>(() => {
    const rows: ProfileMenuEntry[] = [
      {
        id: "overview",
        imgSrc: "/assets/icons/header/new-face/user.svg",
        route: "/profile",
        title: t("header.profileOverview"),
      },
      {
        badgeCounter: Number(notificationCount) || undefined,
        id: "notifications",
        imgSrc: "/assets/icons/header/prof_dropdownn_bell.svg",
        route: "/notifications",
        title: t("header.myNotifications"),
      },
    ];

    if (isOwner)
      rows.push(
        {
          id: "owner-properties",
          imgSrc: "/assets/icons/header/header_my_adds.svg",
          route: "/profile/owner/properties",
          title: t("header.myListings"),
        },
        {
          badgeCounter: Number(activeReserves) || undefined,
          id: "owner-reserves",
          imgSrc: "/assets/icons/header/header_my_adds.svg",
          route: "/profile/owner/reserves",
          title: t("header.reserveRequests"),
        },
      );

    if (profile?.advisor_id)
      rows.push({
        id: "advisor-subscription",
        imgSrc: "/assets/icons/header/header_my_sub.svg",
        route: "/profile/advisor/subscription",
        title: t("header.advisorSection"),
      });

    return [
      ...rows,
      ...profileDropDownItems.map(({ titleKey, ...entry }) => ({
        ...entry,
        title: t(`header.${titleKey}`),
      })),
    ];
  }, [activeReserves, isOwner, notificationCount, profile?.advisor_id, t]);

  return (
    <div className="text-right">
      <Menu
        as="div"
        className="relative group inline-block text-left"
        onMouseEnter={() => buttonRef.current?.click()}
        onMouseLeave={() => buttonRef.current?.click()}
      >
        <MenuButton
          ref={buttonRef}
          className="flex items-center transition-all justify-center col-span-1 gap-2 flex-row"
        >
          {activeReserves ? (
            <PulseDot className="absolute -left-2 -top-0.5 z-1" />
          ) : null}
          <p
            className={`nav-underline relative text-sm ${
              isLight
                ? "text-white group-hover:text-brand-200"
                : "text-black group-hover:text-brand-600"
            } shrink-0 font-medium transition-colors duration-150`}
          >
            {t("header.myProfile")}
          </p>
        </MenuButton>

        <MenuItems
          transition
          className="absolute left-0 z-[60] mt-2 w-48 origin-top rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none overflow-auto px-1 py-2 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {entries.map((entry) => (
            <MenuItem key={entry.id}>
              <Link
                prefetch
                href={entry.route}
                title={entry.title}
                className={ROW_CLASS}
              >
                <span className="relative flex">
                  <CountBadge count={entry.badgeCounter} />
                  <ContentImage
                    alt=""
                    width={24}
                    height={24}
                    src={entry.imgSrc}
                    className="w-6 h-6 aspect-square"
                  />
                </span>
                <span className="ui-body">{entry.title}</span>
              </Link>
            </MenuItem>
          ))}

          <MenuItem>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="text-red-500 flex w-full px-2 items-center rounded-md gap-2 py-2 text-sm font-medium"
            >
              <ContentImage
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 aspect-square"
                src="/assets/icons/header/header_logout.svg"
              />
              {t("header.logout")}
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <ConfirmModal
        isLoading={false}
        isVisible={showConfirm}
        hideText={t("common.no")}
        title={t("header.logout")}
        confirmText={t("common.yes")}
        onConfirm={() => void logout()}
        text={t("header.logoutMessage")}
        onHide={() => setShowConfirm(false)}
      />
    </div>
  );
};

export default HeaderProfileMenu;
