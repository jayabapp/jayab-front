"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ProfileItem = ({
  item,
  disableArrow,
  badgeCounter,
}: {
  item: {
    id: number;
    title: string;
    route: string;
    imgSrc: string;
  };
  disableArrow?: boolean;
  badgeCounter?: number;
}) => {
  const asPath = usePathname();
  const selected = asPath.includes(item?.route);

  const BadgePart = () =>
    !!badgeCounter ? (
      <div className="  aspect-square w-5 h-5  rounded-full   text-white border border-primary-100 bg-primary-150 flex  z-1 items-center justify-center text-[10px]">
        {badgeCounter}
      </div>
    ) : (
      <></>
    );

  return (
    <Link
      prefetch={false}
      href={item?.route}
      className={`   ${
        selected ? "text-primary-700 " : "border-r-transparent "
      }  py-3 md:py-5 flex border-b  last:border-b-0 border-primary-200 items-center w-full justify-between cursor-pointer hover:scale-102 transition-all`}
    >
      <div className="flex items-center gap-3 md:gap-4 relative ">
        <img src={item?.imgSrc} className="dark:invert w-7 h-7 aspect-square" />
        <p className=" text-sm md:text-base  font-medium ">{item?.title}</p>
      </div>{" "}
      {!!disableArrow ? (
        <>
          <BadgePart />
        </>
      ) : (
        <div className="flex items-center gap-1">
          <BadgePart />

          <img src="/assets/icons/shared/chevron.svg" className="rotate-90" />
        </div>
      )}
    </Link>
  );
};

export default ProfileItem;
