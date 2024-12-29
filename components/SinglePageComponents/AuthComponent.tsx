"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthStore, useStoreTheme } from "../../store";
import Image from "next/image";
import TheInstallPrompt from "../../components/InstallPrompt/TheInstallPrompt";
import { AuthService } from "@/api_services/auth/auth.service";
import { HomeService } from "@/api_services/home/home.service";
import Terms from "../auth/Terms";
import Button from "../shared/Button/Button";
import FormInput from "../shared/Form/FormInput";
import Notify from "../shared/Toast";
import { p2e } from "@/helpers/NumberConverter";
import _STRINGS from "@/utils/LocalStrings";
const AuthPageComponent = () => {
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
            if (data) {
              Notify({ type: "success", title: "", body: `${data}` || "" });
            }

            const link = redirectUrl
              ? `/auth/otp?redirect_url=${redirectUrl}&mobile_number=${mobile_number}`
              : `/auth/otp?mobile_number=${mobile_number}`;

            router.push(link);
            useAuthStore.setState({ authCodeExpire: moment().add(3, "minute") });
          },
          onError: () => {
            setLoading(false);
            console.log("err");
          },
        }
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

  const { data: terms, isLoading: termsLoading } = useQuery({
    queryKey: [HomeService?.CONTENT_BY_KEY_CACHEKEY, "terms"],
    queryFn: () => {
      return HomeService.GetContentByKey({ key: "terms" });
    },
  });

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [signUp]);

  function _onKeyDown(e: KeyboardEvent) {
    if (e.code == "Enter") {
      return signUp();
    }
  }

  return (
    <div className="auth-container bg-cover    min-h-screen h-fit flex flex-col gap-8 items-center  md:!pb-8   relative">
      {/* <AuthHeader title={_STRINGS.ENTER} /> */}
      <div className="w-full items-center justify-center flex flex-col gap-4  ">
        {" "}
        <div className="flex relative z-1  w-28 flex-col items-center  gap-2 h-fit aspect-square">
          <Image
            alt="logo"
            fill
            src={`/assets/icons/logo/logo.svg`}
            className=" 
        w-full
   aspect-square
rounded-md
object-contain
"
          />
        </div>
      </div>
      <div className="z-1 w-full gap-8 flex flex-col px-4 items-center  md:w-full lg:w-3/5 mx-auto relative  rounded-2xl pt-4 pb-4 ">
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
            roundedClass="rounded-full"
            loading={loading}
            containerClass="w-full  mt-20"
            width="w-full"
            title={_STRINGS?.ENTER_AND_MOVE_ON}
            onClick={signUp}
          />
        </div>
      </div>

      <Terms
        setvisibleTermsModal={setvisibleTermsModal}
        termsLoading={termsLoading}
        visibleTermsModal={visibleTermsModal}
        termsContent={terms ? terms : { full_text: "", html: "" }}
      />

      <TheInstallPrompt />
    </div>
  );
};

export default AuthPageComponent;
