import _STRINGS from "@/utils/LocalStrings";

const SearchBoxCitiesPartCarts = ({ item, cb, province }: { item: any; province?: boolean; cb: () => void | null }) => {
  return (
    <div
      onClick={cb}
      className="rounded-full gap-4 py-0.5 px-2 pl-1 flex items-center justify-center border border-primary-700/30  bg-primary-700/5  text-xs "
    >
      <p className="text-sm">
        {province && _STRINGS.PROVINCE} {item?.title}
      </p>
      <div className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-primary-700/30  flex items-center justify-center">
        <img
          src="/assets/icons/adds/x_mark.svg"
          className="w-2.5 h-2.5    opacity-30 p-0.5  text-primary-text aspect-square "
        />
      </div>
    </div>
  );
};

export default SearchBoxCitiesPartCarts;
