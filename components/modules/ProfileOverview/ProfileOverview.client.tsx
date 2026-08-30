"use client";

import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useProfileMenu } from "@features/user/hooks/useProfileMenu";
import { isMobile, isTablet } from "react-device-detect";
import { ContentImage } from "@elements/Image";
import { useAuthStore } from "@/store";

import ProfileFormSkeleton from "@features/auth/components/ProfileFormSkeleton";
import ProfileSessionAction from "./parts/ProfileSessionAction.client";
import ProfileIdentity from "./parts/ProfileIdentity.client";
import ProfileMenuList from "./parts/ProfileMenuList.client";
import _STRINGS from "@/utils/LocalStrings";

const ProfileOverview = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const { data: profile, isPending } = useCurrentProfile(isLogin);
  const entries = useProfileMenu(profile, { isLogin });

  const isHandheld = isMobile || isTablet;

  if (!isHandheld)
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

  return (
    <div className="flex flex-col mt-0 lg:mt-4">
      {isPending && isLogin ? <ProfileFormSkeleton /> : null}
      {profile ? <ProfileIdentity profile={profile} /> : null}

      <div className="p-2 rounded-10 mt-4">
        <ProfileMenuList entries={entries} />
        <ProfileSessionAction isLogin={isLogin} />
      </div>
    </div>
  );
};

export default ProfileOverview;
