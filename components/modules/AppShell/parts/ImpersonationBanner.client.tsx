"use client";

import { useAuthStore, useStoreInit } from "@/store";
import { useTranslations } from "next-intl";
import { useLogout } from "@features/auth/hooks/useLogout";

const ImpersonationBanner = () => {
  const t = useTranslations("header");
  const isAdminSso = useAuthStore((state) => state.isAdminSso);
  const userInfo = useStoreInit((state) => state.userInfo);
  const logout = useLogout();

  if (!isAdminSso) return <></>;

  const target = userInfo?.full_name || userInfo?.mobile_number || "";

  return (
    <div className="flex w-full items-center justify-between gap-3 bg-warning-500 px-4 py-2 text-sm text-white">
      <span className="truncate">
        {t("impersonationBanner")}
        {target ? ` ${target}` : ""}
      </span>
      <button
        type="button"
        onClick={() => void logout()}
        className="shrink-0 cursor-pointer rounded-full bg-surface/20 px-3 py-1 font-semibold transition-colors hover:bg-surface/30"
      >
        {t("impersonationExit")}
      </button>
    </div>
  );
};

export default ImpersonationBanner;
