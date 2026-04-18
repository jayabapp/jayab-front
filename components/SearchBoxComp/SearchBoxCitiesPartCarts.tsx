import _STRINGS from "@/utils/LocalStrings";

const SearchBoxCitiesPartCarts = ({ item, cb, province }: { item: any; province?: boolean; cb: () => void | null }) => {
  return (
    <div
      onClick={cb}
      className="  transition-all  hover:brightness-75  cursor-pointer  bg-primary-1000/50 w-full py-0.5 px-2 rounded-md flex items-center justify-between"
    >
      <p className="text-sm">
        {province && _STRINGS.PROVINCE} {item?.title}
      </p>
      <img className=" size-2  opacity-60   " src="/assets/icons/adds/x_mark.svg" />
    </div>
  );
};

export default SearchBoxCitiesPartCarts;
