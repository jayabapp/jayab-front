"use client";

import { useUpdateProfileImage } from "@features/user/hooks/useUpdateProfileImage";
import type { ProfileIdentityProps } from "@/types/components/modules/profile";

import _STRINGS from "@/utils/LocalStrings";
import dynamic from "next/dynamic";

const MainUploader = dynamic(() => import("@/components/uploader"));

const AVATAR_CLASSES = {
  imageClass: " !rounded-full ",
  secontParentClass: "!rounded-full   !aspect-auto ",
  sizeClass: " !rounded-full !w-20 !h-20",
};

const ProfileIdentity = ({ profile }: ProfileIdentityProps) => {
  const { mutate } = useUpdateProfileImage();

  return (
    <div className="flex items-center gap-2">
      <MainUploader
        withCrop
        showCamera
        key="profile-avatar"
        title={_STRINGS.IMAGE}
        innerClasses={AVATAR_CLASSES}
        item={profile?.profile_image}
        link="/attachments?type=PROFILE"
        containerClass="my-3 w-fit flex items-start justify-start"
        onSelect={(file) => mutate({ profile_image_id: file?.id })}
      />
      <div className="flex flex-col gap-3">
        <p className="font-bold">{profile?.full_name}</p>
        <p className="text-sm">{profile?.mobile_number}</p>
      </div>
    </div>
  );
};

export default ProfileIdentity;
