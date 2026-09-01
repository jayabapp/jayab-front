"use client";

import type { ProfileSessionActionProps } from "@/types/components/modules/profile";
import { useLogout } from "@features/auth/hooks/useLogout";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const ProfileSessionAction = ({ isLogin }: ProfileSessionActionProps) => {
  const router = useRouter();
  const logout = useLogout();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isLogin)
    return (
      <Button
        width="w-full"
        containerClass="mt-8 w-full"
        title={_STRINGS?.LOGIN_TO_UR_ACCOUNT}
        onClick={() => router.push("/auth")}
      />
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="py-5 flex items-center w-full gap-3 xl:gap-6 cursor-pointer hover:scale-102 transition-all"
      >
        <ContentImage
          alt=""
          width={24}
          height={24}
          className="w-6 h-6 aspect-square"
          src="/assets/icons/header/header_logout.svg"
        />
        <p className="text-sm xl:text-base font-medium text-danger-500">
          {_STRINGS?.LOGOUT_TITLE}
        </p>
      </button>

      <ConfirmModal
        isLoading={false}
        hideText={_STRINGS.NO}
        isVisible={showConfirm}
        confirmText={_STRINGS.YES}
        title={_STRINGS.LOGGING_OUT}
        text={_STRINGS.LOG_OUT_MESSAGE}
        onConfirm={() => void logout()}
        onHide={() => setShowConfirm(false)}
      />
    </>
  );
};

export default ProfileSessionAction;
