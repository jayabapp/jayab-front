"use client";

import { useAuthStore, useStoreInit } from "@/store";
import { useLogout } from "@features/auth/hooks/useLogout";

import _STRINGS from "@/utils/LocalStrings";

// FEATURE.md §8.2: every page visited during an admin-impersonated session
// must carry a visible "viewing this account from the admin panel" bar with
// an exit action — there was previously no visual indicator at all, even
// though the session cookie (`is_admin_sso`) and its full teardown on
// logout already existed.
const ImpersonationBanner = () => {
  const isAdminSso = useAuthStore((state) => state.isAdminSso);
  const userInfo = useStoreInit((state) => state.userInfo);
  const logout = useLogout();

  if (!isAdminSso) return <></>;

  const target = userInfo?.full_name || userInfo?.mobile_number || "";

  // A plain block at the very top of <body> (see app/layout.tsx) rather than
  // fixed/sticky — that would require reasoning about z-index and scroll
  // behavior against a header implementation this component doesn't own;
  // being present on every impersonated page is what FEATURE.md asks for,
  // not that it stays pinned while scrolling.
  return (
    <div className="flex w-full items-center justify-between gap-3 bg-warning-500 px-4 py-2 text-sm text-white">
      <span className="truncate">
        {_STRINGS.ADMIN_IMPERSONATION_BANNER}
        {target ? ` ${target}` : ""}
      </span>
      <button
        type="button"
        onClick={() => void logout()}
        className="shrink-0 cursor-pointer rounded-full bg-white/20 px-3 py-1 font-semibold transition-colors hover:bg-white/30"
      >
        {_STRINGS.ADMIN_IMPERSONATION_EXIT}
      </button>
    </div>
  );
};

export default ImpersonationBanner;
