"use client";

import { useSyncExternalStore } from "react";
import { isMobile, isTablet } from "react-device-detect";
import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useTranslations } from "next-intl";
import { useProfileMenu } from "@features/user/hooks/useProfileMenu";
import { ContentImage } from "@elements/Image";
import { useAuthStore } from "@/store";

import ProfileFormSkeleton from "@features/auth/components/ProfileFormSkeleton";
import ProfileSessionAction from "./parts/ProfileSessionAction.client";
import ProfileCompletion from "./parts/ProfileCompletion.client";
import ProfileIdentity from "./parts/ProfileIdentity.client";
import ProfileMenuList from "./parts/ProfileMenuList.client";
import ProfileWelcome from "./parts/ProfileWelcome.client";
import ProfileStats from "./parts/ProfileStats.client";

const ProfileOverview = () => {
  const t = useTranslations("profile");

  const isLogin = useAuthStore((state) => state.isLogin);
  const { data: profile, isPending } = useCurrentProfile(isLogin);
  const entries = useProfileMenu(profile, { isLogin });

  const isHandheld = isMobile || isTablet;

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
        <p className="text-sm font-medium">{t("plzSelectAPage")}</p>
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
