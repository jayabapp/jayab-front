"use client";

import type { HeaderSessionBadgeProps } from "@/types/components/modules/site-header";
import { ContentImage } from "@elements/Image";
import { CountBadge } from "@elements/Badge";

import HeaderContactLink from "./HeaderContactLink";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const HeaderSessionBadge = ({
  avatar,
  isLight,
  isLogin,
  notificationCount,
  phone,
  compact = false,
}: HeaderSessionBadgeProps) => (
  <div
    className={`flex shrink-0 items-center ${compact ? "gap-1.5 sm:gap-2" : "gap-3 xl:gap-6"}`}
  >
    <Link
      prefetch={isLogin}
      title={_STRINGS.MY_PROFILE}
      href={isLogin ? "/profile" : "/auth"}
      className={`flex shrink-0 items-center justify-center rounded-full border py-1.5 backdrop-blur-[2px] transition-all ${
        compact ? "gap-1 px-1.5 sm:px-2" : "gap-3 px-2.5"
      } ${isLight ? "border-transparent bg-white/40" : ""}`}
    >
      <ContentImage
        alt=""
        width={24}
        height={24}
        src={avatar || "/assets/icons/header/new-face/user.svg"}
        className={`${isLogin && !avatar ? "xl:brightness-0" : !isLogin && !isLight ? "brightness-0" : ""} ${isLight ? "border-white" : "border-neutral-500"} border shrink-0 size-6 rounded-full transform-gpu transition-all`}
      />

      {isLogin ? (
        <ContentImage
          alt=""
          width={20}
          height={20}
          src="/assets/icons/header/new-face/dots-three-vertical.svg"
          className={`${compact ? "hidden sm:block" : ""} size-5 pl-1 transition-all ${isLight ? "invert brightness-200" : ""}`}
        />
      ) : (
        <p
          className={`${compact ? "hidden min-[360px]:block" : ""} pl-1 text-xs transition-all ${isLight ? "text-white" : ""}`}
        >
          {_STRINGS.ENTER}
        </p>
      )}
    </Link>

    <HeaderContactLink compact={compact} isLight={isLight} phone={phone} />

    {isLogin ? (
      <Link
        prefetch
        href="/notifications"
        title={_STRINGS.MY_NOTIFS}
        className={`relative flex shrink-0 items-center justify-center rounded-full border transition-all ${
          compact ? "size-8" : "size-9"
        } ${
          isLight
            ? "border-white/60 bg-white/35 text-white backdrop-blur-[2px]"
            : "border-brand-100 bg-brand-50 text-neutral-700"
        }`}
      >
        <CountBadge count={notificationCount} />
        <svg
          aria-hidden="true"
          className="size-[1.125rem] shrink-0"
          fill="none"
          viewBox="0 0 17 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.2158 15.9697C10.6166 15.9698 10.9424 16.2945 10.9424 16.6953C10.9423 17.0961 10.6166 17.4209 10.2158 17.4209H6.41504C6.01423 17.4209 5.68952 17.0961 5.68945 16.6953C5.68945 16.2945 6.01419 15.9697 6.41504 15.9697H10.2158ZM8.31543 0C11.595 0.000169558 14.2549 2.65984 14.2549 5.93945V8.91406C14.255 9.29883 14.4722 9.64888 14.8154 9.82227L15.4131 10.1211C16.1587 10.4941 16.6298 11.2563 16.6299 12.0898C16.6299 13.3062 15.6441 14.293 14.4277 14.293H2.20215C0.985844 14.2929 0 13.3062 0 12.0898C0.000126477 11.2561 0.471889 10.4933 1.21777 10.1191L1.81543 9.82129C2.15847 9.64903 2.37588 9.29872 2.37598 8.91406V5.93945C2.37598 2.65973 5.03571 0 8.31543 0Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    ) : null}
  </div>
);

export default HeaderSessionBadge;
