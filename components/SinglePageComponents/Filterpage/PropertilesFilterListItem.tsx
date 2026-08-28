import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";

type TPropertilesFilterProps = {
  isSelected?: boolean;
  cb?: () => void | null;
  item: ProvienceTypesDto;
};

const PropertilesFilterListItem = ({
  cb,
  item,
  isSelected,
}: TPropertilesFilterProps) => {
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
      className={`flex justify-center rounded-2xl border w-full aspect-square flex-col items-center gap-2 ${isSelected ? "border-brand-600" : ""}`}
    >
      <ContentImage
        width={64}
        height={64}
        sizes="(min-width: 768px) 64px, 32px"
        alt={item?.title || ""}
        className=" size-8 md:size-16  rounded-sm "
        src={
          item?.image
            ? NEW_IMAGE_URL(item?.image)
            : "/assets/icons/logo/mobile_header_logo.svg"
        }
      />
      <p className=" text-sm line-clamp-1 md:text-base font-normal md:font-bold">
        {item?.title}
      </p>
    </button>
  );
};

export default PropertilesFilterListItem;
