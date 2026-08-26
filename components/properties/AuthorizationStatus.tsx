import { PropertyListDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";
import { useRouter } from "next/navigation";
import React from "react";

const AuthorizationStatus = ({
  isAuthorized,
  data,
}: {
  isAuthorized: boolean;
  data?: PropertyListDto | SingleOwnerPropertyDto;
}) => {
  const router = useRouter();

  const pusher = (link: string) => {
    router.push(link);
  };

  const onClickFunc = () => {
    if (!!data?.id && !isAuthorized) {
      pusher(`/profile/owner/properties/${data?.id}/license`);
    }
  };

  return (
    <div
      className={` bg-black/5  pl-2 pr-1 py-1 shrink-0 flex items-center  rounded-full gap-2 ${
        isAuthorized ? "" : " custome-shadow-card "
      }  `}
      onClick={onClickFunc}
    >
      <img
        className=" rounded-full w-4 h-4 "
        src={
          isAuthorized ? "/assets/icons/property/green_circled_tick.svg" : "/assets/icons/property/red_exclmation.svg"
        }
      />
      <p className={`${isAuthorized ? "" : "text-primary-900"}  shrink-0 text-xs `}>
        {" "}
        {isAuthorized ? "احراز شده" : "احراز نشده"}
      </p>
    </div>
  );
};

export default AuthorizationStatus;
