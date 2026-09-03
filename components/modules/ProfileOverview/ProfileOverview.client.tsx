"use client";

import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useProfileMenu } from "@features/user/hooks/useProfileMenu";
import { isMobile, isTablet } from "react-device-detect";
import { ContentImage } from "@elements/Image";
import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store";

import ProfileFormSkeleton from "@features/auth/components/ProfileFormSkeleton";
import ProfileSessionAction from "./parts/ProfileSessionAction.client";
import ProfileCompletion from "./parts/ProfileCompletion.client";
import ProfileIdentity from "./parts/ProfileIdentity.client";
import ProfileMenuList from "./parts/ProfileMenuList.client";
import ProfileWelcome from "./parts/ProfileWelcome.client";
import ProfileStats from "./parts/ProfileStats.client";
import _STRINGS from "@/utils/LocalStrings";

const ProfileOverview = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const { data: profile, isPending } = useCurrentProfile(isLogin);
  const entries = useProfileMenu(profile, { isLogin });

  const isHandheld = isMobile || isTablet;

  // This pane is client-owned: it branches on the device (react-device-detect
  // only knows the UA in the browser) and on profile data that lands after
  // hydration, so rendering it during SSR guarantees a hydration mismatch —
  // React then throws away and re-renders the tree. The skeleton is what the
  // server sends instead.
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) return <ProfileFormSkeleton />;

  if (!isHandheld) {
    if (isPending && isLogin) return <ProfileFormSkeleton />;
    if (profile)
      return (
        <ProfileWelcome profile={profile} entries={entries} isLogin={isLogin} />
      );

    return (
      <div className="w-full flex gap-4 items-center justify-center flex-col pt-8 opacity-40">
        <ContentImage
          alt=""
          width={160}
          height={80}
          className="w-1/5 h-auto"
          src="/assets/icons/logo/logo.svg"
        />
        <p className="text-sm font-medium">{_STRINGS.PLZ_SELECT_A_PAGE}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-0 lg:mt-4">
      {isPending && isLogin ? <ProfileFormSkeleton /> : null}
      {profile ? (
        <div className="glass-surface rounded-28 px-4 py-2">
          <ProfileIdentity profile={profile} />
        </div>
      ) : null}

      {profile ? <ProfileCompletion profile={profile} /> : null}
      {isLogin ? <ProfileStats profile={profile} isLogin={isLogin} /> : null}

      <div className="glass-surface rounded-28 px-4 py-1">
        <ProfileMenuList entries={entries} />
        <ProfileSessionAction isLogin={isLogin} />
      </div>
    </div>
  );
};

export default ProfileOverview;
