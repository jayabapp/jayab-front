"use client";

import type { ChromeSlotProps } from "@/types/components/layouts/main-layout";
import { usePathname } from "next/navigation";

const ChromeSlot = ({
  children,
  hiddenOn,
  match = "includes",
}: ChromeSlotProps) => {
  const pathname = usePathname();
  const isHidden =
    match === "exact"
      ? hiddenOn.includes(pathname)
      : hiddenOn.some((route) => pathname?.includes(route));

  return isHidden ? null : <>{children}</>;
};

export default ChromeSlot;
