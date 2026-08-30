"use client";

import type { TPropertyGrid } from "@/types/components/modules/property-discovery";
import { useTrackBannerView } from "@features/home/hooks/useTrackBannerView";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";

import Editable from "@/components/Editable";
import Image from "next/image";
import Link from "next/link";

const PropertyGridBanner = ({ bannerItem, devices }: TPropertyGrid) => {
  const { mutate } = useTrackBannerView();

  const isPhone = devices?.isMobile;

  const href = (() => {
    const link = bannerItem?.link?.trim();
    if (link) {
      if (link.startsWith("http://") || link.startsWith("https://"))
        return link;
      if (link.startsWith("/")) return link;
      return `/${link}`;
    }
    if (bannerItem?.property?.slug) return `/rooms/${bannerItem.property.slug}`;
    return "#";
  })();
  if (isPhone && !bannerItem?.image_sm) return null;
  if (!isPhone && !bannerItem?.image) return null;
  const imageSrc =
    getHomeImageUrl(
      isPhone && bannerItem?.image_sm
        ? bannerItem?.image_sm
        : bannerItem?.image,
    ) || "/assets/images/fake_villa_image.jpg";

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
        title={"بنر"}
        href={href}
        prefetch={false}
        onClick={() => {
          if (href !== "#") mutate({ bannerId: bannerItem?.id });
        }}
        className="w-full h-full rounded-20 object-cover overflow-hidden align-middle block"
      >
        <Image
          fill
          sizes="100vw"
          src={imageSrc}
          alt={`${bannerItem?.id || ""} banner`}
          className="w-full h-full rounded-20 !object-cover aspect-[1.5] md:aspect-[6] overflow-hidden align-middle img-dark"
        />
      </Link>
    </Editable>
  );
};

export default PropertyGridBanner;
