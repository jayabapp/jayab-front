"use client";
import { PropertyService } from "@/api_services/property/property.service";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { useStoreInit, useStoreParams } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const WaitingRoom = () => {
  const router = useRouter();
  const { data: initPropData, refetch } = useQuery({
    queryKey: [PropertyService.OWNER_PROP_INIT_CACHEKEY],
    queryFn: () => PropertyService.InitProperty({ property_id: undefined }),
    enabled: false,
  });

  const { userInfo } = useStoreInit((data) => data);
  const onCreateAddClick = () => {
    if (!!userInfo) {
      if (!userInfo?.owner_id) {
        router.push(`/profile/edit`);
      } else {
        refetch().then((e) => {
          if (!!e?.data) router.push(`/profile/owner/properties/${e?.data?.id}/edit/initials`);
        });
      }
    } else {
      useStoreParams.setState({ loginModal: true, loginModalCancelRoute: "/" });
    }
  };

  useEffect(() => {
    onCreateAddClick();
  }, []);

  return (
    <div className=" w-full container ">
      <LottieLoading />
    </div>
  );
};

export default WaitingRoom;
