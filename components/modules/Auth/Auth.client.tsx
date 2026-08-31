"use client";

import { useAuthForm } from "@features/auth/hooks/useAuthForm";
import { AuthHeader } from "@layouts/AuthHeader";
import { FormInput } from "@elements/Form";

import useCmsContent from "@/hooks/useCmsContent";
import _STRINGS from "@/utils/LocalStrings";
import Terms from "./parts/Terms.client";
import Button from "@elements/Button";
import Image from "next/image";

const AuthPageComponent = () => {
  const {
    submit,
    mobile,
    setMobile,
    isSubmitting,
    visibleTermsModal,
    setVisibleTermsModal,
  } = useAuthForm();

  const { content: terms, isLoading: termsLoading } = useCmsContent("terms");

  return (
    <div className="auth-container bg-cover    min-h-screen h-fit flex flex-col gap-8 items-center  md:!pb-8   relative">
      <AuthHeader title={_STRINGS.ENTER} />
      <div className="w-full gap-8 flex flex-col items-center md:w-3/4 mx-auto relative lg:w-[35%] bg-white  md:shadow-lg md:border    rounded-2xl  pt-0 md:pt-8   pb-8 mt-8 ">
        <div className="w-full items-center justify-center flex flex-col gap-4  ">
          {" "}
          <div className="flex relative z-1  w-28 flex-col items-center  gap-2 h-fit aspect-square">
            <Image
              fill
              alt="logo"
              unoptimized
              src={`/assets/icons/logo/logo.svg`}
              className="w-full aspect-square rounded-md object-contain"
            />
          </div>
        </div>
        <div className="z-1 w-full gap-8 flex flex-col px-4 items-center    mx-auto relative  rounded-2xl pt-4 pb-4 ">
          <div className="w-full flex flex-col gap-2">
            <FormInput
              item={{
                inputClass: " !text-center ltr placeholder:!text-center  ",
                keyboard: "number",
                titleClass: " w-full text-start",
                title: _STRINGS.ENTER_TOUR_MOBILE_NUMBER,
                direction: "ltr",
                containerClass: "w-full  relative",
                autoFocus: false,
                maxLength: 11,
              }}
              onChangeText={(v: number) => {
                setMobile(v);
              }}
              value={mobile}
            />
            <div className="flex items-center gap-3 text-start relative   w-full  text-xs font-normal   my-1">
              <div className="flex items-center gap-0.5 ">
                <p>{_STRINGS.U_ACCEPTED}</p>
                <p
                  className="inline-block underline cursor-pointer font-medium text-pink-1000 mx-1"
                  onClick={() => setVisibleTermsModal(true)}
                >
                  {_STRINGS?.TERMS}
                </p>{" "}
                <p> میباشد</p>
              </div>
            </div>

            <Button
              width="w-full"
              onClick={submit}
              loading={isSubmitting}
              roundedClass="rounded-full"
              containerClass="w-full  mt-20"
              title={_STRINGS?.ENTER_AND_MOVE_ON}
            />
          </div>
        </div>

        <Terms
          termsLoading={termsLoading}
          visibleTermsModal={visibleTermsModal}
          setvisibleTermsModal={setVisibleTermsModal}
          termsContent={terms ? terms : { full_text: "", html: "" }}
        />
      </div>
    </div>
  );
};

export default AuthPageComponent;
