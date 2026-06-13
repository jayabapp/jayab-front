import { HomeLandingDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Link from "next/link";

const PropertyTypeItem = ({ item }: { item: HomeLandingDto }) => {
  return (
    <Link
      title={item?.title}
      href={`/rooms?property_type=${item?.id}`}
      className="flex  justify-center   rounded-2xl  border   aspect-square  flex-col   items-center gap-2"
    >
      <img
        className=" size-8 md:size-16  rounded-sm "
        src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/logo/mobile_header_logo.svg"}
      />
      <p className=" text-sm line-clamp-1 md:text-base font-normal md:font-bold">{item?.title}</p>
    </Link>
  );
};

export default PropertyTypeItem;
