"use client";
import Editable from "@/components/Editable";
import { DeviceInfo } from "@/helpers/device.detector";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
import { useRouter } from "next/navigation";

const HomeProductsBannerItems = ({ bannerItem, devices }: { bannerItem: any; devices?: DeviceInfo }) => {
  const router = useRouter();
  const pusher = (link: string) => {
    router.push(link);
  };

  const isPhone = devices?.isMobile;
  return (
    <>
      {isPhone && !bannerItem?.image_sm ? (
        <> </>
      ) : !isPhone && !bannerItem?.image ? (
        <></>
      ) : (
        <Editable
          isBanner
          contentId={bannerItem?.id}
          className={`group   aspect-[1.5] md:aspect-[6]  focus:outline-none w-full px-0 relative overflow-hidden rounded-md   ${
            bannerItem?.brand_id || bannerItem?.link || bannerItem?.category || bannerItem?.product
              ? "cursor-pointer"
              : ""
          } `}
          onClick={() => {
            if (bannerItem?.property?.slug) {
              pusher(`/rooms/${bannerItem?.property?.slug}`);
            } else if (bannerItem?.link) pusher(bannerItem?.link);
          }}
        >
          <div className="w-full h-full   rounded-20 object-cover overflow-hidden align-middle">
            <Image
              src={
                NEW_IMAGE_URL(!!isPhone && bannerItem?.image_sm ? bannerItem?.image_sm : bannerItem?.image) ||
                "/assets/images/fake_villa_image.jpg"
              }
              fill
              alt={`${bannerItem?.id || ""}banner`}
              className="w-full h-full rounded-20 !object-cover  aspect-[1.5] md:aspect-[6]  overflow-hidden align-middle img-dark"
            />
          </div>
        </Editable>
      )}
    </>
  );
};

export default HomeProductsBannerItems;
