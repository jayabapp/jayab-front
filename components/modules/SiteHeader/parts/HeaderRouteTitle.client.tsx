"use client";

import { useParams, usePathname } from "next/navigation";
import { allRoutes } from "@/utils/constantss";

import _STRINGS from "@/utils/LocalStrings";

const resolveTitle = (pathname: string, hasSlug: boolean) => {
  const segments = pathname?.split("/") ?? [];
  const lastSegment = segments[segments.length - 1];

  if (hasSlug) return _STRINGS.ADDS;
  if (
    pathname?.includes("/profile/owner/properties/") &&
    pathname?.includes("/edit")
  )
    return "ویرایش اطلاعات ملک";
  if (pathname === "/profile/advisor/subscription")
    return _STRINGS.ADVISOR_SECTION;
  if (pathname?.includes("/owner/reserves")) return _STRINGS.RESERVE_REQUESTS;
  if (Object.prototype.hasOwnProperty.call(allRoutes, lastSegment))
    return allRoutes[lastSegment];
  if (pathname?.includes("/products/")) return "صفحه محصول";
  if (pathname?.includes("/photo-upgrade-requests/"))
    return "درخواست های بهبود ";
  if (pathname?.includes("/rooms/")) return _STRINGS.PROPERTY_DETAILS_TITLE;
  if (pathname?.includes("/blog/")) return "مجله گردشگری جایاب";
  if (pathname?.includes("/checkout/")) return "سبد خرید";
  if (pathname?.includes("/orders/")) return "سفارش";
  if (pathname?.includes("/support/")) return "پشتیبانی ";
  if (pathname?.includes("/chat/")) return "پیام ";
  if (pathname?.includes("/owner/properties/")) return "اطلاعات ملک ";
  return lastSegment;
};

const HeaderRouteTitle = () => {
  const params = useParams();
  const pathname = usePathname();

  return <>{resolveTitle(pathname, !!params?.slug)}</>;
};

export default HeaderRouteTitle;
