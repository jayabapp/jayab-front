"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store";
import { useMutation } from "@tanstack/react-query";
import { AuthService } from "@/api_services/auth/auth.service";
import { p2e } from "@/helpers/NumberConverter";

import useCmsContent from "@/hooks/useCmsContent";
import AuthHeader from "../headers/AuthHeader";
import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";
import Notify from "../shared/Toast";
import Image from "next/image";
import Terms from "../auth/Terms";

const AuthPageComponent = () => {
  const { isLogin } = useAuthStore((state) => state);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url");
  const [mobile, setMobile] = useState<number | string>("");
  const [loading, setLoading] = useState(false);
  const [visibleTermsModal, setvisibleTermsModal] = useState(false);
  const { mutate } = useMutation({ mutationFn: AuthService.sendOtp });

  const signUp = () => {
    setLoading(true);
    const mobile_number = p2e(mobile);
    if (mobile_number?.length == 11) {
      mutate(
        { mobile_number: mobile_number || null },
        {
          onSuccess: (data) => {
            if (data?.sandbox_otp_code) {
              Notify({
                type: "info",
                body: `کد ورود سندباکس: ${data.sandbox_otp_code}`,
              });
            }

            const link = redirectUrl
              ? `/auth/otp?redirect_url=${redirectUrl}`
              : `/auth/otp`;

            router.replace(link);
            useAuthStore.setState({ authCodeExpire: data?.expires_at ?? null });
          },
          onError: () => {
            setLoading(false);
            console.log("err");
          },
        },
      );
    } else {
      Notify({
        type: "warn",
        title: _STRINGS.ATTENTION,
        body: _STRINGS.WORNG_NUMBER,
      });
      setLoading(false);
    }
  };

  const { content: terms, isLoading: termsLoading } = useCmsContent("terms");

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [signUp]);

  function _onKeyDown(e: KeyboardEvent) {
    if (e.code == "Enter") return signUp();
  }

  useEffect(() => {
    if (!!isLogin) router.replace("/");
  }, [isLogin]);

  return (
    <div className="auth-container bg-cover    min-h-screen h-fit flex flex-col gap-8 items-center  md:!pb-8   relative">
      <AuthHeader title={_STRINGS.ENTER} />
      <div className="w-full gap-8 flex flex-col items-center md:w-3/4 mx-auto relative lg:w-[35%] bg-white  md:shadow-lg md:border   dark:bg-zinc-900 rounded-2xl  pt-0 md:pt-8   pb-8 mt-8 ">
        <div className="w-full items-center justify-center flex flex-col gap-4  ">
          {" "}
          <div className="flex relative z-1  w-28 flex-col items-center  gap-2 h-fit aspect-square">
            <Image
              fill
              alt="logo"
              src={`/assets/icons/logo/logo.svg`}
              className="w-full aspect-square rounded-md object-contain"
            />
          </div>
        </div>
        <div className="z-1 w-full gap-8 flex flex-col px-4 items-center    mx-auto relative  rounded-2xl pt-4 pb-4 ">
          {/* <div className="font-medium text-xl text-center">{_STRINGS?.A89}</div> */}
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
                  onClick={() => setvisibleTermsModal(true)}
                >
                  {_STRINGS?.TERMS}
                </p>{" "}
                <p> میباشد</p>
              </div>
            </div>

            <Button
              width="w-full"
              onClick={signUp}
              loading={loading}
              roundedClass="rounded-full"
              containerClass="w-full  mt-20"
              title={_STRINGS?.ENTER_AND_MOVE_ON}
            />
          </div>
        </div>

        <Terms
          termsLoading={termsLoading}
          visibleTermsModal={visibleTermsModal}
          setvisibleTermsModal={setvisibleTermsModal}
          termsContent={terms ? terms : { full_text: "", html: "" }}
        />
      </div>
    </div>
  );
};

export default AuthPageComponent;
