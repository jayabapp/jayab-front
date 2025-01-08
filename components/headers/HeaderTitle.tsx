"use client";
import { allRoutes } from "@/utils/constantss";
import { usePathname } from "next/navigation";
import React from "react";

const HeaderTitle = () => {
  const pathname = usePathname();
  let pathArray = pathname?.split("/");
  let lastPart = pathArray[pathArray?.length - 1];
  if (allRoutes.hasOwnProperty(lastPart)) {
    return allRoutes[lastPart];
  } else if (pathname?.includes("/products/")) {
    return "صفحه محصول";
  } else if (pathname?.includes("/blog/")) {
    return "صفحه بلاگ";
  } else if (pathname?.includes("/checkout/")) {
    return "سبد خرید";
  } else if (pathname?.includes("/orders/")) {
    return "سفارش";
  } else if (pathname?.includes("/support/")) {
    return "تیکت ";
  } else if (pathname?.includes("/owner/properties/")) {
    return "اطلاعات ملک ";
  } else {
    return pathArray[pathArray?.length - 1];
  }
};

export default HeaderTitle;
