import { SinglePropDto } from "@/api_services/property/property.interface";
import { PropertyService } from "@/api_services/property/property.service";
import { useStoreParams } from "@/store";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";

const BookMarkButton = ({ data }: { data: SinglePropDto }) => {
  const { bookmarks } = useStoreParams((state) => state);

  const { mutate, isPending } = useMutation({
    mutationFn: PropertyService.BookmarkProperty,
    onSuccess: (e) => {
      useStoreParams.setState({ bookmarks: e?.bookmarks });
    },
  });

  const onSave = () => {
    mutate({ property_id: data?.id });
  };

  return (
    <img
      onClick={() => {
        if (!isPending) onSave();
      }}
      className="w-5 cursor-pointer h-5 aspect-square"
      src={
        bookmarks?.includes(data?.id)
          ? "/assets/icons/adds/filled_bookmark.svg"
          : "/assets/icons/adds/empty_bookmark.svg"
      }
    />
  );
};

export default BookMarkButton;
