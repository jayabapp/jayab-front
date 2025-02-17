"use client";

import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import Button from "@/components/shared/Button/Button";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const InviePage = () => {
  const onShare = async (files: any) => {
    const title = "جایاب";
    const text = "شما را به جایاب دعوت میکنم";
    const url = window.origin;

    const shareDetails = { title, text, url };
    if (navigator.share) {
      try {
        await navigator.share(shareDetails).then(() => console.log("Your content was shared"));
      } catch (error) {}
    }
  };

  const { data: advisorProfile } = useQuery({
    queryKey: [AdvisorService.USER_ADVISORS_PROFILE_CACHEKEY],

    queryFn: () => {
      return AdvisorService.userAdvisorsProfile();
    },
    staleTime: 0,
    gcTime: 0,
  });
  return (
    <div
      id="homeParent"
      className=" profile-container  !pb-36 items-center   !bg-transparent transition-all duration-500 ease-in-out flex flex-col gap-1 "
    >
      <div className=" w-full md:px-[30%]  mt-12   flex flex-col gap-4 ">
        <img src="/assets/images/shared/invite_image.png" />

        <p className="text-center">{_STRINGS.INVITE_TEXT}</p>

        {!!advisorProfile?.is_special ? (
          <div className="flex flex-col w-full items-center justify-center gap-2">
            <p className="text-sm">{_STRINGS.REFRAL_CODE}</p>
            <div className=" w-32  h-10 flex items-center justify-center  border rounded-10 text-sm ">
              <p>{advisorProfile?.user?.referral_code}</p>
            </div>
          </div>
        ) : (
          <></>
        )}

        <Button onClick={onShare} containerClass="w-full" width="w-full" title={_STRINGS.SHARE} />
      </div>
    </div>
  );
};

export default InviePage;
