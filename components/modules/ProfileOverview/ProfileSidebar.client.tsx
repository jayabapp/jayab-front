"use client";

import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useProfileMenu } from "@features/user/hooks/useProfileMenu";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store";

import ProfileFormSkeleton from "@features/auth/components/ProfileFormSkeleton";
import ProfileSessionAction from "./parts/ProfileSessionAction.client";
import ProfileIdentity from "./parts/ProfileIdentity.client";
import ProfileMenuList from "./parts/ProfileMenuList.client";

const ProfileSidebar = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  // Same reason as the overview pane: the sidebar is built from the session and
  // the profile response, neither of which the server has, so rendering it
  // during SSR is a hydration mismatch waiting on a race.
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const { data: profile } = useCurrentProfile(isLogin);
  const entries = useProfileMenu(profile, {
    includeMobileOnly: false,
    isLogin,
  });

  if (!mounted)
    return (
      <div className="z-5 w-full">
        <div className="glass-surface rounded-28 px-4 py-6">
          <ProfileFormSkeleton />
        </div>
      </div>
    );

  return (
    <div className="z-5 w-full">
      <div className="glass-surface rounded-28 flex flex-col gap-2 px-3 pb-8 overflow-scroll">
        <div className="flex items-center px-2 py-2">
          <ProfileIdentity profile={profile} />
        </div>
        <ProfileMenuList compact entries={entries} />
        <ProfileSessionAction isLogin={isLogin} />
      </div>
    </div>
  );
};

export default ProfileSidebar;
