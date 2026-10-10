"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";
import { useLogout } from "@features/auth/hooks/useLogout";
import { useState } from "react";

import type { ProfileSessionActionProps } from "@/types/components/modules/profile";

import ConfirmModal from "@elements/Modal/ConfirmModal.client";
import Button from "@elements/Button";

const ProfileSessionAction = ({ isLogin }: ProfileSessionActionProps) => {
  const t = useTranslations();

  const router = useRouter();
  const logout = useLogout();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isLogin)
    return (
      <Button
        width="w-full"
        containerClass="mt-8 w-full"
        title={t("common.loginToUrAccount")}
        onClick={() => router.push("/auth")}
      />
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="group py-5 flex items-center w-full gap-3 xl:gap-6 cursor-pointer text-danger-500 transition-colors hover:text-danger-600"
      >
        <ContentImage
          alt=""
          width={24}
          height={24}
          className="w-6 h-6 aspect-square"
          src="/assets/icons/header/header_logout.svg"
        />
        <p className="nav-underline relative text-sm xl:text-base font-medium">
          {t("header.logout")}
        </p>
      </button>

      <ConfirmModal
        isLoading={false}
        isVisible={showConfirm}
        hideText={t("common.no")}
        title={t("header.logout")}
        confirmText={t("common.yes")}
        onConfirm={() => void logout()}
        text={t("header.logoutMessage")}
        onHide={() => setShowConfirm(false)}
      />
    </>
  );
};

export default ProfileSessionAction;
