"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useStoreParams } from "@/store";
import { memo } from "react";

import Modal from "@elements/Modal";

const LoginModal = () => {
  const t = useTranslations("auth.loginModal");
  const router = useRouter();
  const pathname = usePathname();
  const replacer = (url: string) => {
    router.replace(url);
  };

  const { loginModal, loginModalCancelRoute } = useStoreParams(
    (state) => state,
  );
  const closeDispatch = () => {
    useStoreParams.setState({
      loginModal: false,
      loginModalCancelRoute: "",
    });
  };

  const title = t("title"),
    body = t("description"),
    yes = t("confirm"),
    no = t("dismiss");
  return (
    <Modal
      show={loginModal}
      onHide={() => {
        if (!!loginModalCancelRoute) replacer(loginModalCancelRoute);
        closeDispatch();
      }}
    >
      <div className="pt-4 pb-4 px-3 text-ink ">
        <div className="mb-4 text-lg font-medium text-center">{title}</div>
        <p className=" text-center mb-6 font-light ">{body}</p>
        <div className="flex items-center justify-between gap-5 px-4">
          <button
            className="bg-action   w-full hover:ring-4 hover:ring-action/50 px-2 py-3 rounded-lg text-on-action"
            onClick={() => {
              const target = `${pathname}${window.location.search}`;
              router.push(`/auth?redirect_url=${encodeURIComponent(target)}`);
              closeDispatch();
            }}
          >
            {yes}
          </button>
          <button
            className="bg-line-strong   w-full hover:ring-4 hover:ring-neutral-600/50 px-2 py-3 rounded-lg text-ink-muted "
            onClick={() => {
              if (!!loginModalCancelRoute) replacer(loginModalCancelRoute);
              closeDispatch();
            }}
          >
            {no}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(LoginModal);
