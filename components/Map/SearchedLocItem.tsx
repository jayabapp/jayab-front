import type { SearchedLocation } from "@/types/features/map";

type TSearchedLocProps = {
  item: SearchedLocation;
  locationClickFunc: (e: SearchedLocation) => void;
};

const SearchedLocItem = ({ item, locationClickFunc }: TSearchedLocProps) => {
  return (
    <div
      onClick={() => {
        locationClickFunc(item);
      }}
      className="w-full flex items-start cursor-pointer px-4 pb-4 border-b border-cream-100  gap-4"
    >
      <img src="/assets/icons/adds/pin_point_location.svg" className="" />
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
