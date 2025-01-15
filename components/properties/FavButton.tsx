import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import { useAuthStore, useStoreParams } from "@/store";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const FavButton = ({ data }: { data: SinglePropDto }) => {
  const { likes } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.LikeProperty,
    onSuccess: (e) => {
      useStoreParams.setState({ likes: e?.favorites });
    },
  });

  const onLike = () => {
    if (!!isLogin) {
      mutate({ property_id: data?.id });
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  return (
    <img
      onClick={() => {
        if (!isPending) onLike();
      }}
      className="w-5 cursor-pointer h-5 aspect-square"
      src={likes?.includes(data?.id) ? "/assets/icons/adds/filled_heart.svg" : "/assets/icons/adds/empty_heart.svg"}
    />
  );
};

export default FavButton;
