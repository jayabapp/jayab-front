import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { useRouter } from "next/navigation";

const PropertilesFilterListItem = ({
  item,
  isSelected,
  cb,
}: {
  item: ProvienceTypesDto;
  isSelected?: boolean;
  cb?: () => void | null;
}) => {
  const router = useRouter();

  return (
    <button
      id={item?.title}
      data-umami-event-id={item?.title}
      data-umami-event={"Category Select"}
      onClick={() => {
        if (!!cb) {
          cb();
        }
      }}
      className={`flex  justify-center   rounded-2xl  border   w-full aspect-square  flex-col   items-center gap-2 ${isSelected ? "border-primary-700" : ""}`}
    >
      <img
        className=" size-8 md:size-16  rounded-sm "
        src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/logo/mobile_header_logo.svg"}
      />
      <p className=" text-sm line-clamp-1 md:text-base font-normal md:font-bold">{item?.title}</p>
    </button>
  );
};

export default PropertilesFilterListItem;
