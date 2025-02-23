"use client";
import Editable from "@/components/Editable";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { isMobile } from "react-device-detect";

const HomeProductsBannerItems = ({ bannerItem }: { bannerItem: any }) => {
  const router = useRouter();
  const pusher = (link: string) => {
    router.push(link);
  };
  return (
    <Editable
      isBanner
      contentId={bannerItem?.id}
      className={`group   aspect-[3] md:aspect-[4]  focus:outline-none w-full px-0 relative overflow-hidden rounded-md   ${
        bannerItem?.brand_id || bannerItem?.link || bannerItem?.category || bannerItem?.product ? "cursor-pointer" : ""
      } `}
      onClick={() => {
        if (bannerItem?.property?.slug) {
          pusher(`/rooms/${bannerItem?.property?.slug}`);
        } else if (bannerItem?.link) pusher(bannerItem?.link);
      }}
    >
      <div className="invisible">sd</div>
      <div className="w-full h-full rounded-20 object-cover overflow-hidden align-middle">
        <Image
          src={
            NEW_IMAGE_URL(isMobile && bannerItem?.image_sm ? bannerItem?.image_sm : bannerItem?.image) ||
            "/assets/images/fake_villa_image.jpg"
          }
          fill
          alt={`${bannerItem?.id || ""}banner`}
          className="w-full h-full rounded-20 !object-cover overflow-hidden align-middle img-dark"
        />
      </div>
    </Editable>
  );
};

export default HomeProductsBannerItems;
