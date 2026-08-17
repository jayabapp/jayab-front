"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthQueriesStore, useAuthStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { calculateTimeLeft } from "@/helpers/calculateTimeLeft";
import { safeInternalPath } from "@/helpers/safeRedirect";
import { AuthService } from "@/api_services/auth/auth.service";
import { setCookie } from "cookies-next/client";
import { p2e } from "@/helpers/NumberConverter";

import AuthHeader from "@/components/headers/AuthHeader";
import _STRINGS from "@/utils/LocalStrings";
import OtpInput from "./OtpInput";
import Button from "@/components/shared/Button/Button";
import Notify from "@/components/shared/Toast";
import Image from "next/image";

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
  const redirectUrl = params.get("redirect_url");

  const { data: challenge, isLoading: challengeLoading } = useQuery({
    queryKey: [AuthService.OTP_CHALLENGE_CACHEKEY],
    queryFn: AuthService.getOtpChallenge,
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

  const [disable, setDisable] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const { authCodeExpire } = useAuthStore((state) => state);
  const [countdown, setCountdown] = useState<{
    minutes: string;
    seconds: string;
  }>({ minutes: "00", seconds: "00" });
  const { auth_queries } = useAuthQueriesStore();
  const router = useRouter();
  const queryClient = useQueryClient();

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
    if (!challengeLoading && !challenge) router.replace("/auth");
  }, [challengeLoading, challenge]);
  const codeExpiry = challenge?.expires_at ?? authCodeExpire;

  useEffect(() => {
    const interval = setInterval(() => {
      const time = calculateTimeLeft(!!codeExpiry ? `${codeExpiry}` : "");
      setCountdown(time);
      if (time?.minutes == "00" && time.seconds == "00")
        clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [codeExpiry]);

  useEffect(() => {
    if (otp?.length == 4) ref?.current?.click();
  }, [otp]);

  const { mutate: onResend } = useMutation({
    mutationFn: () => AuthService.sendOtp(),
    onSuccess: (data) => {
      if (data?.sandbox_otp_code) {
        Notify({
          type: "info",
          body: `کد ورود سندباکس: ${data.sandbox_otp_code}`,
        });
      }

      setReset(!reset);
      useAuthStore.setState({ authCodeExpire: data?.expires_at ?? null });
      queryClient.setQueryData([AuthService.OTP_CHALLENGE_CACHEKEY], data);
    },
    onError: () => {
      console.log("err");
    },
  });

  function editNumber() {
    void AuthService.clearOtpChallenge();
    router.replace("/");
  }

  function validOtp() {
    if (!otp || otp.length <= 3) {
      Notify({
        type: "warn",
        title: _STRINGS?.ATTENTION,
        body: _STRINGS?.SHORT_CODE,
      });
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
      useAuthQueriesStore.setState({ auth_queries: null });
      localStorage.setItem("socket_token", data?.socket_token || "");
      if (data?.needs_registration) {
        const link = redirectUrl
          ? `/auth/register?redirect_url=${redirectUrl}`
          : `/auth/register`;
        setTimeout(() => {
          router.replace(link);
        }, 2000);
      } else {
        setCookie("isLogin", "true", { maxAge: 60 * 24 * 60 * 60 });
        setTimeout(() => {
          router.replace(safeInternalPath(redirectUrl) ?? `/`);
          authUserStore.setState({ isLogin: true });
        }, 2000);
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

    if (
      !numericCode ||
      isNaN(Number(numericCode)) ||
      numericCode?.length <= 3
    ) {
      setDisable(false);
      return Notify({
        type: "warn",
        title: _STRINGS?.ATTENTION,
        body: _STRINGS?.SHORT_CODE,
      });
    }

    const body = {
      code: numericCode,
      query_params: { redirectUrl: redirectUrl || undefined, ...auth_queries },
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
            onClick={() => onResend()}
          >
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
      <AuthHeader title={_STRINGS.CONFIRM_CODE} customeBackRoute="/auth" />
      <div className="w-full md:shadow-lg md:border   gap-6 flex flex-col items-center md:w-3/4 mx-auto relative lg:w-[35%]   dark:bg-zinc-900  rounded-2xl pt-0 md:pt-8 pb-8 mt-8 ">
        <div className="w-full items-center justify-center flex flex-col gap-4  ">
          {" "}
          <div className="flex relative z-1  w-28 flex-col items-center  gap-2 h-fit aspect-square">
            <Image
              fill
              alt="logo"
              src={"/assets/icons/logo/logo.svg"}
              className="w-full aspect-square rounded-md object-contain"
            />
          </div>
        </div>
        <div className="z-1 w-full gap-8 flex flex-col px-4 items-center md:w-full mx-auto relative  rounded-2xl pt-4 pb-4 ">
          <div className="w-full flex flex-col gap-8">
            <div className="px-1 lg:px-4 2xl:px-8 flex  items-start justify-center  flex-col gap-1">
              <div className="flex items-center gap-2" onClick={editNumber}>
                <bdi dir="ltr" className="inline-block text-base font-medium">
                  {challenge?.masked_mobile}{" "}
                </bdi>
              </div>
              <p className=" text-xs">{_STRINGS?.ENTER_FOUR_DIGITS}</p>
              <OtpInput setValue={setOtp} refresh={reset} />
            </div>
            <div className="flex items-center justify-between">
              <div
                onClick={editNumber}
                className=" cursor-pointer flex items-center gap-1 "
              >
                <img
                  src="/assets/icons/edit/blue_edit_pen.svg"
                  className="w-4 h-4 aspect-square"
                />
                <p className="text-sm  text-primary-700 ">
                  {_STRINGS.EDIT_NUMBER}
                </p>
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
    </div>
  );
};

export default OtpPageSignInComponent;
