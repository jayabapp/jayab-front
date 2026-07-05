"use client";
import { allRoutes } from "@/utils/constantss";
import { useParams, usePathname } from "next/navigation";

const HeaderTitle = () => {
  const pathname = usePathname();
  const params = useParams();
  let pathArray = pathname?.split("/");
  let lastPart = pathArray[pathArray?.length - 1];
  if (!!params?.slug) {
    return "آگهی ها";
  } else if (pathname?.includes("/profile/owner/properties/") && pathname?.includes("/edit")) {
    return "ویرایش اطلاعات ملک";
  } else if (pathname == "/profile/advisor/subscription") {
    return "بخش مشاور";
  } else if (pathname?.includes("/owner/reserves")) {
    return "درخواست های رزرو";
  } else if (allRoutes.hasOwnProperty(lastPart)) {
    return allRoutes[lastPart];
  } else if (pathname?.includes("/products/")) {
    return "صفحه محصول";
  } else if (pathname?.includes("/photo-upgrade-requests/")) {
    return "درخواست های بهینه سازی ";
  } else if (pathname?.includes("/rooms/")) {
    return "جزئیات ملک";
  } else if (pathname?.includes("/blog/")) {
    return "مجله گردشگری جایاب";
  } else if (pathname?.includes("/checkout/")) {
    return "سبد خرید";
  } else if (pathname?.includes("/orders/")) {
    return "سفارش";
  } else if (pathname?.includes("/support/")) {
    return "پشتیبانی ";
  } else if (pathname?.includes("/chat/")) {
    return "پیام ";
  } else if (pathname?.includes("/owner/properties/")) {
    return "اطلاعات ملک ";
  } else {
    return pathArray[pathArray?.length - 1];
  }
};

export default HeaderTitle;
