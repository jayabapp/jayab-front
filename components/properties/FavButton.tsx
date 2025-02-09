import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import { useAuthStore, useStoreParams } from "@/store";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const FavButton = ({
  data,
  setFavCount,
}: {
  data: SinglePropDto;
  setFavCount: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { likes } = useStoreParams((state) => state);
  const { isLogin } = useAuthStore((state) => state);
  const [like, setLike] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.LikeProperty,
    onSuccess: (e) => {
      if (!!setFavCount) {
        setFavCount((e) => (!!like ? e + 1 : e - 1));
      }
      useStoreParams.setState({ likes: e?.favorites });
    },
    onError: (e) => {
      setLike((e) => !e);
    },
  });

  const onLike = () => {
    if (!!isLogin) {
      mutate({ property_id: data?.id });
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  useEffect(() => {
    if (likes?.includes(data?.id)) {
      setLike(true);
    }
  }, [likes, data]);

  const onClick = () => {
    if (!isPending) {
      setLike((e) => !e);
      onLike();
    }
  };

  return (
    <img
      onClick={() => {
        onClick();
      }}
      className="  w-4 md:w-5 cursor-pointer h-4 md:h-5 aspect-square"
      src={like ? "/assets/icons/adds/filled_heart.svg" : "/assets/icons/adds/empty_heart.svg"}
    />
  );
};

export default FavButton;
