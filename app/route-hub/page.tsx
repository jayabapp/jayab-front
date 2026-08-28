"use client";

import { useStoreInit, useStoreParams } from "@/store";
import { useEffect, useEffectEvent } from "react";
import { PropertyService } from "@/api_services/property/property.service";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import PropertyEditStepSkeleton from "@features/owner-property/steps/PropertyEditStepSkeleton";

const WaitingRoom = () => {
  const router = useRouter();
  const { refetch } = useQuery({
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
          if (!!e?.data)
            router.push(
              `/profile/owner/properties/${e?.data?.id}/edit/initials`,
            );
        });
      }
    } else {
      useStoreParams.setState({ loginModal: true, loginModalCancelRoute: "/" });
    }
  };
  const startNavigation = useEffectEvent(onCreateAddClick);

  useEffect(() => {
    startNavigation();
  }, []);

  return (
    <div className=" w-full container ">
      <PropertyEditStepSkeleton variant="form" />
    </div>
  );
};

export default WaitingRoom;
