"use client";

import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useProfileMenu } from "@features/user/hooks/useProfileMenu";
import { useAuthStore } from "@/store";

import ProfileSessionAction from "./parts/ProfileSessionAction.client";
import ProfileIdentity from "./parts/ProfileIdentity.client";
import ProfileMenuList from "./parts/ProfileMenuList.client";

const ProfileSidebar = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const { data: profile } = useCurrentProfile(isLogin);
  const entries = useProfileMenu(profile, {
    includeMobileOnly: false,
    isLogin,
  });

  return (
    <div className="z-5 w-full">
      <div className="bg-white rounded-20 flex flex-col gap-2 pb-10 overflow-scroll">
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
