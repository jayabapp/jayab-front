import type { SearchedLocationItemProps } from "@/types/components/modules/property-map";
import { ContentImage } from "@elements/Image";

const SearchedLocItem = ({
  item,
  locationClickFunc,
}: SearchedLocationItemProps) => {
  return (
    <div
      onClick={() => {
        locationClickFunc(item);
      }}
      className="w-full flex items-start cursor-pointer px-4 pb-4 border-b border-cream-100  gap-4"
    >
      <ContentImage
        alt=""
        width={24}
        height={24}
        src="/assets/icons/adds/pin_point_location.svg"
      />
      <div className="flex h-full justify-between flex-col gap-1">
        <div className="text-sm">
          {item?.title}{" "}
          {item?.neighbourhood ? `(${item?.neighbourhood})` : <></>}
        </div>
        <p className="text-sm">{item?.address}</p>
      </div>
    </div>
  );
};
export default SearchedLocItem;
