"use client";

import { useCreatePropertyEntry } from "@features/owner-property/hooks/useCreatePropertyEntry";
import { useAdvisorProfile } from "@features/advisors/hooks/useAdvisorProfile";
import { useUnreadChatCount } from "@features/chat/hooks/useUnreadChatCount";
import type { MobileNavEntry } from "@/types/components/modules/mobile-nav";
import { subscriptionStatus } from "@/helpers/subscriptionStatus";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore, useStoreParams } from "@/store";
import { useEffect, useState } from "react";
import { isIOS } from "react-device-detect";
import { colors } from "@/theme/colors";

import MobileNavCreateButton from "./parts/MobileNavCreateButton.client";
import MobileNavItem from "./parts/MobileNavItem.client";
import _STRINGS from "@/utils/LocalStrings";
import throttle from "lodash/throttle";

const SCROLL_DELTA = 20;
const ADVISOR_PENDING_STATUS_ID = 20;
const ADVISOR_BADGE_DAYS_LEFT = 3;

const RIGHT_ITEMS: MobileNavEntry[] = [
  {
    icon: "/assets/icons/navbar/home_nav.svg",
    id: 2,
    route: "/",
    title: _STRINGS.HOME,
  },
  {
    icon: "/assets/icons/navbar/footer_consultancy.svg",
    id: 142142,
    route: "/advisors",
    title: _STRINGS.CONSULTAMCY,
  },
];

const LEFT_ITEMS: MobileNavEntry[] = [
  {
    icon: "/assets/icons/navbar/footer_chat.svg",
    id: 242,
    route: "/chat",
    title: _STRINGS.CHAT,
  },
  {
    icon: "/assets/icons/navbar/my_jayab_v2.svg",
    id: 1442,
    route: "/profile",
    title: _STRINGS.MY_PROFILE,
  },
];

const isStandalone = () =>
  document.referrer.startsWith("android-app://") ||
  window.matchMedia("(display-mode: standalone)").matches;

const MobileNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const { isLogin } = useAuthStore((state) => state);
  const { owmerActiveReservesCount } = useStoreParams((state) => state);
  const { start: onCreateProperty } = useCreatePropertyEntry();

  const { data: chatBadge } = useUnreadChatCount(
    Boolean(isLogin) && (pathname === "/" || pathname === "/chat"),
  );
  const { data: advisorProfile } = useAdvisorProfile(Boolean(isLogin));
  const { isActive, remainingDays } = subscriptionStatus(
    advisorProfile?.subscription_expired_at,
  );
  const advisorHasBadge =
    advisorProfile?.status?.id == ADVISOR_PENDING_STATUS_ID &&
    (!isActive || remainingDays <= ADVISOR_BADGE_DAYS_LEFT);

  useEffect(() => {
    let previousScrollTop = 0;
    const handleScroll = throttle(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const delta = scrollTop - previousScrollTop;
      if (delta > SCROLL_DELTA) setIsVisible(false);
      else if (delta < -SCROLL_DELTA) setIsVisible(true);
      previousScrollTop = Math.max(scrollTop, 0);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, []);

  const onNavigate = (route: string) => {
    if (pathname === route) return;
    useStoreParams.setState({ sideBarStatus: false });
    router.push(route);
  };

  const hasBadge = (route: string) =>
    (route === "/advisors" && Boolean(advisorHasBadge)) ||
    (route === "/chat" && Boolean(chatBadge?.unread_count)) ||
    (route === "/profile" && Boolean(owmerActiveReservesCount));

  return (
    <AnimatePresence mode="sync">
      {isVisible ? (
        <motion.div
          key="mobile-nav"
          exit={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          initial={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          style={{
            filter: `drop-shadow(0px -4px 30px ${colors.neutral[900]}25)`,
          }}
          className={`z-10 max-w-[800px] ${isIOS && isStandalone() ? "pb-8" : "pb-6"} flex lg:hidden pt-3 justify-between !touch-none md:rounded-md left-0 right-0 mx-auto items-center fixed bottom-0 w-full bg-white`}
        >
          <div className="flex w-full items-center justify-around px-3">
            {RIGHT_ITEMS.map((entry) => (
              <MobileNavItem
                entry={entry}
                key={entry.id}
                onSelect={onNavigate}
                hasBadge={hasBadge(entry.route)}
              />
            ))}

            <MobileNavCreateButton onSelect={onCreateProperty} />

            {LEFT_ITEMS.map((entry) => (
              <MobileNavItem
                entry={entry}
                key={entry.id}
                onSelect={onNavigate}
                hasBadge={hasBadge(entry.route)}
              />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileNav;
