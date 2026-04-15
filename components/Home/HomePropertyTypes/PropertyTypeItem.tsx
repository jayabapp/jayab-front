import { HomeLandingDto } from "@/api_services/home/home.interface";
import Link from "next/link";

const PropertyTypeItem = ({ item }: { item: HomeLandingDto }) => {
  return (
    <Link href={`/rooms?property_type=${item?.id}`} className="flex items-center gap-2">
      <img className=" size-11  " src={"/assets/icons/logo/mobile_header_logo.svg"} />
      <p className="text-base font-bold">{item?.title}</p>
    </Link>
  );
};

export default PropertyTypeItem;
