"use client";

import OtpInput from "./OtpInput";
import { useMutation } from "@tanstack/react-query";
import moment from "moment-jalaali";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AuthService } from "@/api_services/auth/auth.service";
import AuthHeader from "@/components/headers/AuthHeader";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import { p2e } from "@/helpers/NumberConverter";
import _STRINGS from "@/utils/LocalStrings";
import { useAuthStore } from "@/store";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";

const OtpPageSignInComponent = ({
  socket,
  authUserStore,
}: {
  socket: any;

  authUserStore: any;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [reset, setReset] = useState<boolean>(false);
  const params = useSearchParams();
  const mobile_number = params.get("mobile_number");
  const redirectUrl = params.get("redirect_url");
  // const role = params.get("role");

  const [disable, setDisable] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const { authCodeExpire } = useAuthStore((state) => state);
  const [countdown, setCountdown] = useState<{ minutes: string; seconds: string }>({ minutes: "00", seconds: "00" });

  const router = useRouter();

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, [onSubmit]);

  function _onKeyDown(e: KeyboardEvent) {
    if (e.code == "Enter") validOtp();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const time = calculateTimeLeft(!!authCodeExpire ? `${authCodeExpire}` : "");
      setCountdown(time);
      if (time?.minutes == "00" && time.seconds == "00") clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [authCodeExpire]);

  useEffect(() => {
    if (otp?.length == 4) {
      // setTimeout(() => {
      // validOtp();
      // }, 1000);

      ref?.current?.click();
    }
  }, [otp]);

  const { mutate: onResend } = useMutation({
    mutationFn: AuthService.sendOtp,
    onSuccess: (data) => {
      if (data) {
        Notify({ type: "success", title: "", body: `${data}` || "" });
      }
      setReset(!reset);
      useAuthStore.setState({ authCodeExpire: moment().add(3, "minute") });
    },
    onError: () => {
      console.log("err");
    },
  });

  function validOtp() {
    if (!otp || otp.length <= 3) {
      Notify({ type: "warn", title: _STRINGS?.ATTENTION, body: _STRINGS?.SHORT_CODE });
    } else {
      onSubmit();
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: AuthService.confirmOtp,
    onSuccess: (data) => {
      socket?.connect();
      socket?.on("client-connected", (e: any) => {
        console.log("client-connected", e);
      });

      localStorage.setItem("access_token", data?.access_token || data?.auth_token || "");
      localStorage.setItem("socket_token", data?.socket_token || "");
      if (data?.auth_token) {
        const link = redirectUrl ? `/auth/register?redirect_url=${redirectUrl}` : `/auth/register`;
        router.replace(link);
      } else {
        localStorage.setItem("isLogin", "true");

        authUserStore.setState({ isLogin: true });
        router.replace(redirectUrl ? redirectUrl : `/`);
      }
    },
    onError: () => {
      setDisable(false);
      console.log("err");
    },
    retry: false,
  });

  function onSubmit() {
    setDisable(true);

    const numericCode: string = p2e(otp);

    if (!numericCode || isNaN(Number(numericCode)) || numericCode?.length <= 3) {
      setDisable(false);
      return Notify({ type: "warn", title: _STRINGS?.ATTENTION, body: _STRINGS?.SHORT_CODE });
    }

    const body = {
      mobile_number: mobile_number,
      code: numericCode,
    };

    if (!disable) mutate(body);
  }

  function _renderCountdown() {
    const counter = countdown;
    if (!!counter) {
      if (counter.seconds == "00" && counter.minutes == "00") {
        return (
          <div
            className=" flex items-center justify-center  gap-2 text-sm   py-1.5  rounded-md w-fit  text-primary-700 cursor-pointer"
            onClick={() => onResend({ mobile_number: mobile_number })}
          >
            {/* <img src="/assets/icons/auth/refresh.svg" /> */}
            <p className="text-primary-700 "> {_STRINGS.SEND_AGAIN}</p>
          </div>
        );
      } else
        return (
          <div className="w-fit flex items-center justify-end">
            {" "}
            <div className="  grid grid-cols-2  gap-2 items-center   w-fit   text-sm  py-1.5 rounded-md  ">
              <p className="text-sm">{_STRINGS.CODE_EXPI_TIME} : </p>
              <p className="w-6">{`${counter?.minutes || "00"}:${counter?.seconds || "00"}`}</p>
            </div>{" "}
          </div>
        );
    }
  }

  return (
    <div className="auth-container bg-cover !rounded-none   min-h-screen h-fit flex flex-col gap-8 items-center  md:!pb-8   relative">
      <AuthHeader title={_STRINGS.ENTER} customeBackRoute="/auth" />
      <div className="w-full items-center justify-center flex flex-col gap-4  ">
        {" "}
        <div className="flex relative z-1  w-28 flex-col items-center  gap-2 h-fit aspect-square">
          <Image
            alt="logo"
            fill
            src={"/assets/icons/logo/logo.svg"}
            className=" 
        w-full
   aspect-square
rounded-md
object-contain
"
          />
        </div>
      </div>
      <div className="z-1 w-full gap-8 flex flex-col px-4 items-center md:w-full mx-auto relative lg:w-3/5  rounded-2xl pt-4 pb-4 ">
        <div className="w-full flex flex-col gap-8">
          <div className="px-1 lg:px-4 2xl:px-8 flex  items-start justify-center  flex-col gap-1">
            <div
              className="flex items-center gap-2"
              onClick={() => {
                router.back();
              }}
            >
              <p className="text-base font-medium">{mobile_number} </p>
            </div>
            <p className=" text-xs">{_STRINGS?.ENTER_FOUR_DIGITS}</p>
            <OtpInput setValue={setOtp} refresh={reset} />
          </div>
          <div className="flex items-center justify-between">
            <div
              onClick={() => {
                router.back();
              }}
              className=" cursor-pointer flex items-center gap-1 "
            >
              <img src="/assets/icons/edit/blue_edit_pen.svg" className="w-4 h-4 aspect-square" />
              <p className="text-sm  text-primary-700 ">{_STRINGS.EDIT_NUMBER}</p>
            </div>
            {_renderCountdown()}
          </div>
          <Button
            containerClass="w-full mt-16 "
            width="w-full"
            roundedClass="rounded-full"
            disabled={disable}
            loading={isPending}
            onClick={() => {
              validOtp();
            }}
            title={_STRINGS?.ENTER_AND_MOVE_ON}
            passRef={ref}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpPageSignInComponent;
