"use client";
import { useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import Modal from ".";
type LoginModalType = {
  visibleLoginModal: boolean;
  setvisibleLoginModal: (e: boolean) => void | null;
};

const LoginModal = () => {
  const router = useRouter();
  const pathname = usePathname();
  const replacer = (url: string) => {
    router.replace(url);
  };

  const { loginModal, loginModalCancelRoute } = useStoreParams((state) => state);
  const closeDispatch = () => {
    useStoreParams.setState({ loginModal: false });
  };

  const title = _STRINGS.LOGIN_MODAL_TITLE,
    body = _STRINGS.LOGIN_MODAL_DESC,
    yes = _STRINGS.LOGIN_SUBMIT_YES,
    no = _STRINGS.NOW_NOW;
  // toLogin=_STRINGS
  return (
    <Modal
      show={loginModal}
      onHide={() => {
        if (!!loginModalCancelRoute) {
          replacer(loginModalCancelRoute);
        }
        closeDispatch();
      }}
    >
      <div className="pt-4 pb-4 px-3 text-black ">
        {/* <img src="/assets/icons/logo/timche-logo.svg" className="w-36 h-20 object-contain mx-auto" alt="" /> */}
        <div className="mb-4 text-lg font-medium text-center">{title}</div>
        <p className=" text-center mb-6 font-light ">{body}</p>
        <div className="flex items-center justify-between gap-5 px-4">
          <button
            className="bg-brand-600   w-full hover:ring-4 hover:ring-brand-600/50 px-2 py-3 rounded-lg text-white"
            onClick={() => {
              router.push(`/auth?redirect_url=${pathname}`);
              closeDispatch();
            }}
          >
            {yes}
          </button>
          <button
            className="bg-neutral-300   w-full hover:ring-4 hover:ring-neutral-600/50 px-2 py-3 rounded-lg text-neutral-600 "
            onClick={() => {
              if (!!loginModalCancelRoute) {
                replacer(loginModalCancelRoute);
              }
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

export default React.memo(LoginModal);
