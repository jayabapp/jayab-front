"use client";

import { HomeService } from "@/api_services/home/home.service";
import Editable from "@/components/Editable";
import { DeviceInfo } from "@/helpers/device.detector";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

const HomeProductsBannerItems = ({ bannerItem, devices }: { bannerItem: any; devices?: DeviceInfo }) => {
  const { mutate } = useMutation({
    mutationFn: HomeService.updateBannerViewCount,
  });

  const isPhone = devices?.isMobile;

  // Build safe href
  const href = (() => {
    const link = bannerItem?.link?.trim();

    // Priority: explicit link
    if (link) {
      // External URL
      if (link.startsWith("http://") || link.startsWith("https://")) {
        return link;
      }

      // Internal URL
      if (link.startsWith("/")) {
        return link;
      }

      // Fix malformed internal paths
      return `/${link}`;
    }

    // Fallback to property slug
    if (bannerItem?.property?.slug) {
      return `/rooms/${bannerItem.property.slug}`;
    }

    // Prevent invalid href
    return "#";
  })();

  // Hide if no image available for current device
  if (isPhone && !bannerItem?.image_sm) {
    return null;
  }

  if (!isPhone && !bannerItem?.image) {
    return null;
  }

  const imageSrc =
    NEW_IMAGE_URL(isPhone && bannerItem?.image_sm ? bannerItem?.image_sm : bannerItem?.image) ||
    "/assets/images/fake_villa_image.jpg";

  const isClickable =
    href !== "#" &&
    (bannerItem?.brand_id ||
      bannerItem?.link ||
      bannerItem?.category ||
      bannerItem?.product ||
      bannerItem?.property?.slug);

  return (
    <Editable
      isBanner
      key={bannerItem?.id}
      contentId={bannerItem?.id}
      className={`group aspect-[1.5] md:aspect-[6] focus:outline-none w-full px-0 relative overflow-hidden rounded-md ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      <Link
        href={href}
        prefetch={false}
        onClick={() => {
          // Avoid unnecessary mutation for invalid links
          if (href !== "#") {
            mutate({ bannerId: bannerItem?.id });
          }
        }}
        className="w-full h-full rounded-20 object-cover overflow-hidden align-middle block"
      >
        <Image
          src={imageSrc}
          fill
          priority={false}
          alt={`${bannerItem?.id || ""} banner`}
          className="w-full h-full rounded-20 !object-cover aspect-[1.5] md:aspect-[6] overflow-hidden align-middle img-dark"
        />
      </Link>
    </Editable>
  );
};

export default HomeProductsBannerItems;
