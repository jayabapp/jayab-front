import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Image from "next/image";
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
      className={` ${
        isSelected ? " bg-primary-100" : ""
      }     flex flex-col gap-2 items-center p-1.5  rounded-10 w-full group  select-none transition-all duration-500 `}
    >
      <div id={`${item?.title || "fake"}CatImage`} className=" w-2/3 lg:w-full    relative   aspect-square z-30">
        {" "}
        <Image
          src={item?.image ? NEW_IMAGE_URL(item?.image) : "/assets/icons/shared/image_placeholder.svg"}
          alt={`icatImages${item?.title}`}
          fill
          className={`mix-blend-multiply z-2    dark:mix-blend-normal    w-full transition-all duration-500 aspect-square  ${
            !!item?.image ? "!object-cover" : "!object-contain opacity-50  md:px-8"
          }

   
          `}
        />
      </div>

      <p className={`font-normal opacity-80 text-sm text-center  line-clamp-1 `}>{item?.title}</p>
    </button>
  );
};

export default PropertilesFilterListItem;
