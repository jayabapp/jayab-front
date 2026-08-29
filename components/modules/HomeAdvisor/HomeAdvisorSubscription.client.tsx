"use client";

import { useHomeAdvisorProfile } from "@features/home/hooks/useHomeAdvisorProfile";
import { ContentImage } from "@elements/Image";
import { useAuthStore } from "@/store";

import _STRINGS from "@/utils/LocalStrings";
import timeLeft from "@/helpers/timeLeft";
import moment from "moment-jalaali";
import Link from "next/link";

const HomeAdvisorSub = () => {
  const { isLogin } = useAuthStore((state) => state);

  const { data: advisorProfile } = useHomeAdvisorProfile(isLogin);
  const isActive = moment().isBefore(advisorProfile?.subscription_expired_at);
  const remainingDays = moment(advisorProfile?.subscription_expired_at).diff(
    moment(),
    "days",
  );
  return (
    <>
      {" "}
      {advisorProfile ? (
        <div className="w-full  mb-4 items-center justify-center   flex flex-col lg:flex-row gap-2">
          {advisorProfile?.status?.id == 20 &&
          !!isActive &&
          remainingDays <= 3 ? (
            <Link
              title={
                !!advisorProfile?.subscription_expired_at
                  ? _STRINGS.EXPIRED
                  : _STRINGS.WAITING_FOR_PAYMENT
              }
              href={`/profile/advisor/subscription`}
              className="w-full md:w-[90%] lg:w-[30%] rounded-full flex items-center justify-center gap-4 h-10 bg-warning-600 "
            >
              <ContentImage
                alt=""
                height={20}
                width={20}
                className="w-5   h-5 aspect-square"
                src="/assets/icons/home/white_alarm.svg"
              />
              <p className="text-white">
                {_STRINGS.EXPIRES_IN} :{" "}
                {timeLeft(advisorProfile?.subscription_expired_at, false)}
              </p>
            </Link>
          ) : (
            <></>
          )}
          {advisorProfile?.status?.id == 20 && !isActive ? (
            <Link
              title={
                !!advisorProfile?.subscription_expired_at
                  ? _STRINGS.EXPIRED
                  : _STRINGS.WAITING_FOR_PAYMENT
              }
              href={`/profile/advisor/subscription`}
              className="w-full md:w-[90%] lg:w-[30%] rounded-full flex items-center justify-center gap-4 h-10 bg-danger-500 "
            >
              <ContentImage
                alt=""
                height={20}
                width={20}
                className="w-5 h-5 aspect-square"
                src="/assets/icons/home/white_alarm.svg"
              />
              <p className="text-white">
                {!!advisorProfile?.subscription_expired_at
                  ? _STRINGS.EXPIRED
                  : _STRINGS.WAITING_FOR_PAYMENT}
              </p>
            </Link>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <> </>
      )}{" "}
    </>
  );
};

export default HomeAdvisorSub;
