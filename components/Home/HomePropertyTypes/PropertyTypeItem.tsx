import { HomeLandingDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Link from "next/link";

const PropertyTypeItem = ({ item }: { item: HomeLandingDto }) => {
  return (
    <Link
      href={`/rooms?property_type=${item?.id}`}
      className="flex  justify-center lg:justify-start  rounded-2xl  border   aspect-square lg:aspect-auto lg:border-transparent flex-col lg:flex-row  items-center gap-2"
    >
      <img
        className=" size-11  rounded-sm "
        src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/logo/mobile_header_logo.svg"}
      />
      <p className=" text-xs line-clamp-1 md:text-base font-normal md:font-bold">{item?.title}</p>
    </Link>
  );
};

export default PropertyTypeItem;
