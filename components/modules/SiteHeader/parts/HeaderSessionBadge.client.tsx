"use client";

import type { HeaderSessionBadgeProps } from "@/types/components/modules/site-header";
import { ContentImage } from "@elements/Image";
import { CountBadge } from "@elements/Badge";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const HeaderSessionBadge = ({
  avatar,
  isLight,
  isLogin,
  notificationCount,
}: HeaderSessionBadgeProps) => (
  <div className="flex items-center gap-3 xl:gap-6 shrink-0">
    <Link
      prefetch={false}
      title={_STRINGS.MY_PROFILE}
      href={isLogin ? "/profile" : "/auth"}
      className={`py-1.5 backdrop-blur-[2px] px-2.5 flex items-center gap-3 ${isLight ? "bg-white/40 border-transparent" : ""} border relative shrink-0 transition-all rounded-full justify-center`}
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
          className={`size-5 pl-1 transition-all ${isLight ? "invert brightness-200" : ""}`}
        />
      ) : (
        <p
          className={`text-xs pl-1 transition-all ${isLight ? "text-white" : ""}`}
        >
          {_STRINGS.ENTER}
        </p>
      )}
    </Link>

    {isLogin ? (
      <Link
        prefetch={false}
        href="/notifications"
        title={_STRINGS.MY_NOTIFS}
        className="relative w-5 h-5 transition-all aspect-square shrink-0 flex"
      >
        <CountBadge count={notificationCount} />
        <ContentImage
          alt=""
          width={20}
          height={20}
          src="/assets/icons/header/white_bell.svg"
          className={`w-5 h-5 transition-all aspect-square transform-gpu shrink-0 ${isLight ? "" : "invert opacity-40"}`}
        />
      </Link>
    ) : null}
  </div>
);

export default HeaderSessionBadge;
