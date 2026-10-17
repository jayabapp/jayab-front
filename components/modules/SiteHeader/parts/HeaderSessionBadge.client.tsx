"use client";

import { DisplayPreferences } from "@modules/DisplayPreferences";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { CountBadge } from "@elements/Badge";

import type { HeaderSessionBadgeProps } from "@/types/components/modules/site-header";

import HeaderContactLink from "./HeaderContactLink";
import Link from "next/link";

const HIT_AREA = "after:absolute after:-inset-1.5 after:content-['']";

const USER_GLYPH = [
  "M9.43164 16.3413C7.40763 16.3413 5.74119 17.9254 5.74119 20.0001C5.74119 20.4094 5.40934 20.7413 4.99999 20.7413C4.59064 20.7413 4.25879 20.4094 4.25879 20.0001C4.25879 17.0748 6.62113 14.8589 9.43164 14.8589H14.5683C17.5017 14.8589 19.7412 17.1967 19.7412 20.0001C19.7412 20.4094 19.4093 20.7413 19 20.7413C18.5906 20.7413 18.2588 20.4094 18.2588 20.0001C18.2588 18.0034 16.671 16.3413 14.5683 16.3413H9.43164Z",
  "M14.5516 5.74024C13.1275 4.41734 10.9621 4.41992 9.54086 5.74799C8.17531 7.02403 8.20628 9.24215 9.5731 10.684C10.8615 12.0432 13.1049 12.0116 14.5599 10.652C15.943 9.35958 15.9695 7.15644 14.5516 5.74024ZM15.5812 4.64934C13.5806 2.78266 10.5162 2.78355 8.51673 4.65201C6.45782 6.57597 6.62829 9.75785 8.48449 11.716C10.4191 13.7568 13.6145 13.5884 15.584 11.748C17.6218 9.84374 17.5988 6.65481 15.6031 4.6705C15.5996 4.66692 15.5959 4.66336 15.5923 4.65983C15.5886 4.65629 15.5849 4.65279 15.5812 4.64934Z",
];

const HeaderSessionBadge = ({
  phone,
  avatar,
  isLight,
  isLogin,
  compact = false,
  notificationCount,
}: HeaderSessionBadgeProps) => {
  const t = useTranslations();

  const slim = compact && isLogin;

  return (
    <div
      className={`flex shrink-0 items-center ${slim ? "gap-3" : compact ? "gap-1.5 sm:gap-2" : "gap-3 xl:gap-6"}`}
    >
      {slim ? (
        <Link
          prefetch
          href="/profile"
          title={t("header.myProfile")}
          className={`${HIT_AREA} relative flex size-8 shrink-0 items-center justify-center rounded-full ${
            isLight ? "bg-surface/35 text-white" : "bg-selected text-ink-muted"
          }`}
        >
          {avatar ? (
            <ContentImage
              alt=""
              width={32}
              height={32}
              src={avatar}
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              {USER_GLYPH.map((d) => (
                <path key={d} d={d} fillRule="evenodd" clipRule="evenodd" />
              ))}
            </svg>
          )}
        </Link>
      ) : (
        <Link
          prefetch={isLogin}
          title={t("header.myProfile")}
          href={isLogin ? "/profile" : "/auth"}
          className={`flex shrink-0 items-center justify-center rounded-full border py-1.5 backdrop-blur-[2px] transition-all ${
            compact ? "gap-1 px-1.5 sm:px-2" : "gap-3 px-2.5"
          } ${isLight ? "border-transparent bg-surface/40" : ""}`}
        >
          <ContentImage
            alt=""
            width={24}
            height={24}
            src={avatar || "/assets/icons/header/new-face/user.svg"}
            className={`${isLogin && !avatar ? "xl:brightness-0" : !isLogin && !isLight ? "brightness-0" : ""} ${isLight ? "border-white" : "border-control"} border shrink-0 size-6 rounded-full transform-gpu transition-all`}
          />

          {isLogin ? (
            <ContentImage
              alt=""
              width={20}
              height={20}
              src="/assets/icons/header/new-face/dots-three-vertical.svg"
              className={`${compact ? "hidden sm:block" : ""} size-5 pe-1 transition-all ${isLight ? "invert brightness-200" : ""}`}
            />
          ) : (
            <p
              dir="auto"
              className={`${compact ? "hidden min-[360px]:block" : ""} pe-1 text-xs transition-all ${isLight ? "text-white" : ""}`}
            >
              {t("common.enter")}
            </p>
          )}
        </Link>
      )}

      {compact ? <></> : <HeaderContactLink isLight={isLight} phone={phone} />}

      <DisplayPreferences overHero={isLight} compact={slim} />

      {isLogin ? (
        <Link
          prefetch
          href="/notifications"
          title={t("header.myNotifications")}
          className={`relative flex shrink-0 items-center justify-center rounded-full border transition-all ${
            compact ? `size-8 ${HIT_AREA}` : "size-9"
          } ${
            isLight
              ? "border-white/60 bg-surface/35 text-white backdrop-blur-[2px]"
              : "border-selected-line bg-selected text-ink-muted"
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
};

export default HeaderSessionBadge;
