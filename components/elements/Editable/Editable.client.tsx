"use client";

import { ContentImage } from "@elements/Image";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";

const Editable = ({
  contentId,
  children,
  containerClass,
  isParent,
  editIconClass,
  isBanner,
  ...props
}: any) => {
  const url = `${process?.env?.NEXT_PUBLIC_PANEL_URL}${
    isParent
      ? "/content-categories/edit/"
      : isBanner
        ? "/banners/edit/"
        : "/contents/edit/"
  }`;

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() =>
      setIsAdmin(!!getCookie("canEdit")),
    );
    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return (
    <div className={`w-full relative ${containerClass}   `}>
      <div {...props}>
        {isAdmin ? (
          <a
            title={"ویرایش"}
            target="_blank"
            referrerPolicy="no-referrer"
            href={url + contentId}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={` text-orange-400 z-2 absolute p-2 rounded-md flex items-center justify-center bg-teal-400 cursor-pointer left-0 top-0 ${editIconClass}`}
          >
            <ContentImage
              width={16}
              height={16}
              alt="admin_edit_icon"
              className="w-4 aspect-square"
              src="/assets/icons/home/edit.svg"
            />
          </a>
        ) : (
          <></>
        )}
        {children}
      </div>
    </div>
  );
};

export default Editable;
