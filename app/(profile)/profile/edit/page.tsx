"use client";

import { useCurrentProfile } from "@features/auth/hooks/useCurrentProfile";
import { useOwnerProfile } from "@features/auth/hooks/useOwnerProfile";
import { useAuthStore } from "@/store";

import OwnerRegistrationForm from "@features/auth/components/OwnerRegistrationForm";
import ProfileFormSkeleton from "@features/auth/components/ProfileFormSkeleton";

const EditCreateProfile = () => {
  const isLogin = useAuthStore((state) => state.isLogin);
  const profile = useCurrentProfile(isLogin);
  const ownerProfile = useOwnerProfile(isLogin);

  if (profile.isPending || ownerProfile.isPending) {
    return (
      <div className="profile-container">
        <ProfileFormSkeleton />
      </div>
    );
  }

  return (
    <OwnerRegistrationForm
      profile={profile.data}
      ownerProfile={ownerProfile.data}
      key={`${profile.data?.id ?? "profile"}-${ownerProfile.data?.id ?? "owner"}`}
    />
  );
};

export default EditCreateProfile;
