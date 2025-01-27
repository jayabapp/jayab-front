import { ProvienceTypesDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import React, { ReactNode } from "react";

const ModalHeaderPart = ({
  onHide,
  title,
  hideArrow,
  children,
}: {
  onHide: () => void | null;
  title: string;
  hideArrow?: boolean;
  children?: ReactNode;
}) => {
  return (
    <div className="app-text flex     border-b items-center justify-center md:justify-between py-3 px-4 sticky top-0 bg-white dark:bg-zinc-800 z-10">
      {!!hideArrow ? (
        <></>
      ) : (
        <img
          src="/assets/icons/shared/chevron.svg"
          className="w-4 absolute top-4 right-2  -rotate-90 md:hidden block h-4 dark:invert"
          alt=""
          onClick={onHide}
        />
      )}
      <div className="flex flex-row gap-2">
        {" "}
        <h3 className=" text-base font-semibold">{title}</h3>
      </div>{" "}
      <img
        src="/assets/icons/adds/x_mark.svg"
        className="w-3  hidden md:block h-3 dark:invert"
        alt=""
        onClick={onHide}
      />
      {children}
    </div>
  );
};

export default ModalHeaderPart;
