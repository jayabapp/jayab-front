"use client";

import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { useAuthStore } from "@/store";
import { STALE_TIME } from "@/helpers/queryCache";
import { useQuery } from "@tanstack/react-query";

import _STRINGS from "@/utils/LocalStrings";
import timeLeft from "@/helpers/timeLeft";
import moment from "moment-jalaali";
import Link from "next/link";

const HomeAdvisorSub = () => {
  const { isLogin } = useAuthStore((state) => state);

  const { data: advisorProfile } = useQuery({
    queryKey: [AdvisorService.USER_ADVISORS_PROFILE_CACHEKEY, isLogin],
    queryFn: () => {
      if (!!isLogin) return AdvisorService.userAdvisorsProfile();
      else return null;
    },
    staleTime: STALE_TIME.DEFAULT,
  });
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
              className="w-full md:w-[90%] lg:w-[30%] rounded-full flex items-center justify-center gap-4 h-10 bg-primary-350 "
            >
              <img
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
              className="w-full md:w-[90%] lg:w-[30%] rounded-full flex items-center justify-center gap-4 h-10 bg-primary-150 "
            >
              <img
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
