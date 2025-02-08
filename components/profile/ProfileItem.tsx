"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ProfileItem = ({
  item,
  disableArrow,
}: {
  item: {
    id: number;
    title: string;
    route: string;
    imgSrc: string;
  };
  disableArrow?: boolean;
}) => {
  const asPath = usePathname();
  const selected = asPath.includes(item?.route);

  return (
    <Link
      href={item?.route}
      className={`   ${
        selected ? "text-primary-700 " : "border-r-transparent "
      }  py-3 md:py-5 flex border-b  last:border-b-0 border-primary-200 items-center w-full justify-between cursor-pointer hover:scale-102 transition-all`}
    >
      <div className="flex items-center gap-3 md:gap-4 ">
        <img src={item?.imgSrc} className="dark:invert w-7 h-7 aspect-square" />
        <p className=" text-base  font-medium ">{item?.title}</p>
      </div>{" "}
      {!!disableArrow ? <></> : <img src="/assets/icons/shared/chevron.svg" className="rotate-90" />}
    </Link>
  );
};

export default ProfileItem;
