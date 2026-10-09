"use client";

import { useParams, usePathname } from "next/navigation";
import { isRouteTitleKey } from "@/utils/constantss";
import { useTranslations } from "next-intl";

const HeaderRouteTitle = () => {
  const t = useTranslations();
  const params = useParams();
  const pathname = usePathname();

  const resolveTitle = (pathname: string, hasSlug: boolean) => {
    const segments = pathname?.split("/") ?? [];
    const lastSegment = segments[segments.length - 1];

    if (hasSlug) return t("header.listings");
    if (
      pathname?.includes("/profile/owner/properties/") &&
      pathname?.includes("/edit")
    )
      return t("header.pageTitle.editProperty");
    if (pathname === "/profile/advisor/subscription")
      return t("header.advisorSection");
    if (pathname?.includes("/owner/reserves")) return t("header.reserveRequests");
    if (isRouteTitleKey(lastSegment)) return t(`routes.${lastSegment}`);
    if (pathname?.includes("/products/")) return t("header.pageTitle.product");
    if (pathname?.includes("/photo-upgrade-requests/"))
      return t("header.pageTitle.photoUpgrade");
    if (pathname?.includes("/rooms/")) return t("header.propertyDetails");
    if (pathname?.includes("/blog/")) return t("header.pageTitle.blogArticle");
    if (pathname?.includes("/checkout/")) return t("header.pageTitle.checkout");
    if (pathname?.includes("/orders/")) return t("header.pageTitle.order");
    if (pathname?.includes("/support/")) return t("header.pageTitle.support");
    if (pathname?.includes("/chat/")) return t("header.pageTitle.message");
    if (pathname?.includes("/owner/properties/"))
      return t("header.pageTitle.propertyInfo");
    return lastSegment;
  };

  return <>{resolveTitle(pathname, !!params?.slug)}</>;
};

export default HeaderRouteTitle;
