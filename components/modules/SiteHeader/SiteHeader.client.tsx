"use client";

import { useCreatePropertyEntry } from "@features/owner-property/hooks/useCreatePropertyEntry";
import { useNotificationBadge } from "@features/notifications/hooks/useNotificationBadge";
import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";
import { sheetBelowHeader, useHeaderAutoHide } from "@hooks/useHeaderAutoHide";
import type { SiteHeaderProps } from "@/types/components/modules/site-header";
import { useUnreadChatCount } from "@features/chat/hooks/useUnreadChatCount";
import { getUserAvatarUrl } from "@features/user/mappers/user-image.mapper";
import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { subscriptionStatus } from "@/helpers/subscriptionStatus";
import { headerWithFullSeach } from "@/utils/constantss";
import { useParams, usePathname } from "next/navigation";
import { useAuthStore, useStoreParams } from "@/store";
import { memo, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import HeaderDesktopNav from "./parts/HeaderDesktopNav.client";
import HeaderMobileBar from "./parts/HeaderMobileBar.client";
import throttle from "lodash/throttle";
import Script from "next/script";

const TOP_HEADER_SCROLL_THRESHOLD = 60;
const ADVISOR_PENDING_STATUS_ID = 20;
const ADVISOR_BADGE_DAYS_LEFT = 3;

const SiteHeader = ({ phone, variant = "page" }: SiteHeaderProps) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { isLogin } = useAuthStore((state) => state);
  const { topHeaderVisible } = useStoreParams((state) => state);

  const isHome = pathname === "/";
  const isLight = isHome && topHeaderVisible;
  const isModal = variant === "modal";
  const headerId = isModal ? "headerContainerModal" : "headerContainer";

  const handleScroll = useMemo(
    () =>
      throttle(() => {
        const overSheet = isHome
          ? sheetBelowHeader(document.getElementById(headerId))
          : null;
        const visible =
          overSheet ?? window.scrollY <= TOP_HEADER_SCROLL_THRESHOLD;
        if (useStoreParams.getState().topHeaderVisible !== visible)
          useStoreParams.setState({ topHeaderVisible: visible });
      }, 100),
    [headerId, isHome],
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  useHeaderAutoHide(headerId, isHome && !isModal);

  const { data: profile } = useCurrentProfile(Boolean(isLogin));
  const { data: notificationCount = 0 } = useNotificationBadge(
    Boolean(isLogin),
  );
  const { data: chatBadge } = useUnreadChatCount(
    Boolean(isLogin) && (isHome || pathname === "/chat"),
  );
  const { data: advisorProfile } = useAdvisorProfile(Boolean(isLogin));
  const { start: onCreateProperty } = useCreatePropertyEntry();

  const { isActive, remainingDays } = subscriptionStatus(
    advisorProfile?.subscription_expired_at,
  );

  const advisorHasBadge =
    advisorProfile?.status?.id == ADVISOR_PENDING_STATUS_ID &&
    (!isActive || remainingDays <= ADVISOR_BADGE_DAYS_LEFT);

  const onRegisterAdvisor = () => {
    if (isLogin) router.push("/profile/advisor/subscription");
    else useStoreParams.setState({ loginModal: true });
  };

  const avatar = profile?.profile_image
    ? getUserAvatarUrl(profile.profile_image)
    : null;

  return (
    <header className="relative">
      <Script
        id="mediaad-retargeting"
        strategy="lazyOnload"
        src="https://s1.mediaad.org/serve/118386/retargeting.js"
      />

      <div
        id={isModal ? "headerContainerModal" : "headerContainer"}
        className={`${isLight ? "bg-gradient-to-b from-black/30 to-black/0 md:pb-24" : ""} transition-all ease-out duration-300 header-content-container w-full mx-auto`}
      >
        <div
          className={`flex justify-between transition-all items-center xl:gap-[10%] duration-300 padding-x py-2 xl:py-4 ${
            isLight
              ? " bg-transparent "
              : topHeaderVisible
                ? " bg-white "
                : ` bg-white ${headerWithFullSeach.includes(pathname) || !!params?.slug ? " border-b xl:border-b-0 xl:shadow-glass-sm" : "shadow-glass-sm"} `
          }`}
        >
          <HeaderMobileBar
            phone={phone}
            avatar={avatar}
            isHome={isHome}
            isLight={isLight}
            isLogin={Boolean(isLogin)}
            isAdvisor={!!profile?.advisor_id}
            notificationCount={notificationCount}
            onRegisterAdvisor={onRegisterAdvisor}
            boxId={isModal ? "SEARCH_BOX_Mobile_Modal" : "SEARCH_BOX_Mobile"}
          />

          <HeaderDesktopNav
            phone={phone}
            avatar={avatar}
            isHome={isHome}
            isLight={isLight}
            isLogin={Boolean(isLogin)}
            advisorHasBadge={advisorHasBadge}
            onCreateProperty={onCreateProperty}
            notificationCount={notificationCount}
            chatCount={chatBadge?.unread_count ?? 0}
            boxId={isModal ? "SEARCH_BOX_Modal" : "SEARCH_BOX"}
          />
        </div>
      </div>
    </header>
  );
};

export default memo(SiteHeader);
