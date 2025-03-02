"use client";
import { useRouter } from "next/navigation";
import React from "react";
import Modal from ".";
import _STRINGS from "@/utils/LocalStrings";
import { useStoreParams } from "@/store";
type LoginModalType = {
  visibleLoginModal: boolean;
  setvisibleLoginModal: (e: boolean) => void | null;
};

const LoginModal = () => {
  const router = useRouter();
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
      <div className="pt-4 pb-4 px-3 text-black dark:text-gray-300">
        {/* <img src="/assets/icons/logo/timche-logo.svg" className="w-36 h-20 object-contain mx-auto" alt="" /> */}
        <div className="mb-4 text-lg font-medium text-center">{title}</div>
        <p className=" text-center mb-6 font-light ">{body}</p>
        <div className="flex items-center justify-between gap-5 px-4">
          <button
            className="bg-primary-700 dark:bg-primary-600  w-full hover:ring-4 hover:ring-primary-700/50 px-2 py-3 rounded-lg text-white"
            onClick={() => {
              router.push(`/auth?redirect_url=${window?.location?.href}`);
              closeDispatch();
            }}
          >
            {yes}
          </button>
          <button
            className="bg-gray-300 dark:bg-gray-500  w-full hover:ring-4 hover:ring-gray-600/50 px-2 py-3 rounded-lg text-gray-600 dark:text-gray-200"
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
