"use client";
import { FiltersEnum } from "@/enum/filters.enum";
import queryBuilder from "@/helpers/queryBuilder";
import { usePathname, useRouter } from "next/navigation";

const SpecialFilterButon = ({ item, isChecked, cb }: { item: any; isChecked: boolean; cb: () => void | null }) => {
  return (
    <div
      onClick={cb}
      className={`rounded-full !w-auto   ${!!isChecked ? " border-primary-700  bg-primary-700/5 text-primary-700" : "  opacity-70"}  transition-all  cursor-pointer  gap-0   py-1 h-[1.625rem] pl-2 pr-1 flex items-center justify-center border      text-xs `}
    >
      <div className="flex items-center gap-1">
        <img src={item?.img} className={`size-5 transition-all ${isChecked ? "" : "grayscale opacity-60"} `} />

        <p className="text-xs pr-2 shrink-0">{item?.title} </p>
      </div>
      {!!isChecked ? (
        <>
          <div className=" cursor-pointer w-4 h-4  mr-2 aspect-square rounded-full border border-primary-700 flex items-center justify-center">
            <img src="/assets/icons/adds/blue_plus.svg" className="w-2 h-2 rotate-45 aspect-square " />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

const SpecialFilterButtons = ({
  query,
  hiddenFilters,
  containerClass,
}: {
  query: any;
  hiddenFilters?: string[];
  containerClass?: string;
}) => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const queryMaker = (value: any, queryKey: string) => {
    console.log(value, queryKey, "ssssssssss");
    let temp = { ...query };
    const body = {
      ...temp,
    };

    if (!!value) {
      body[queryKey] = value;
    } else {
      delete body[queryKey];
    }
    delete body.page;
    replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className={` flex items-center justify-start gap-2 ${containerClass || ""} `}>
      <SpecialFilterButon
        item={{ title: "ممتاز", img: "/assets/icons/adds/verified_hexy_badge.svg" }}
        isChecked={query?.[FiltersEnum.HAS_BLUE_TICK] == "1"}
        cb={() => {
          queryMaker(!!query?.[FiltersEnum.HAS_BLUE_TICK] ? null : 1, FiltersEnum.HAS_BLUE_TICK);
        }}
      />
      <SpecialFilterButon
        item={{ title: "احراز شده", img: "/assets/icons/adds/green_circular_tick.svg" }}
        isChecked={query?.[FiltersEnum.IS_AUTHORIZED] == "1"}
        cb={() => {
          queryMaker(!!query?.[FiltersEnum.IS_AUTHORIZED] ? null : 1, FiltersEnum.IS_AUTHORIZED);
        }}
      />
    </div>
  );
};

export default SpecialFilterButtons;
