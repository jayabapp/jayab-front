"use client";

import { Transition, TransitionChild } from "@headlessui/react";
import { shareLinks } from "@/utils/constantss";
import { ContentImage } from "@elements/Image";
import { isMobile } from "react-device-detect";
import { useState } from "react";

import Notify from "@elements/Toast";

const ShareLink = ({
  containerClass = "flex-row relative justify-start",
  hasTitle = false,
  itemsClass = "flex items-center ",
  itemChildClass = "",
  passedHref = "",
}) => {
  const [visibleSocials, setvisibleSocials] = useState(false);
  const url =
    passedHref ||
    (typeof window === "undefined"
      ? ""
      : `${window.location.href}?utm_source=true`);
  const onShare = async () => {
    const title = "جایاب";
    const text = "";
    if (isMobile) {
      const shareDetails = { url, title, text };
      if (navigator.share) {
        try {
          await navigator
            .share(shareDetails)
            .then(() => console.log("Your content was shared"));
        } catch {}
      } else {
        setvisibleSocials((e) => !e);
      }
    } else {
      setvisibleSocials((e) => !e);
    }
  };
  const copyLink = () => {
    if (!navigator) return;
    navigator.clipboard.writeText(url);
    Notify({
      type: "success",
      body: "لینک مورد نظر کپی شد",
    });
  };

  return (
    <div className={`flex ${containerClass} items-center`} onClick={onShare}>
      {" "}
      <div
        className={`flex items-center  rounded-md   justify-center    cursor-pointer     transition-all  ${
          hasTitle && "bg-opacity-60"
        }`}
      >
        <ContentImage
          alt=""
          width={20}
          height={20}
          src="/assets/icons/property/share_icon.svg"
          className="cursor-pointer w-5 h-5 grayscale   hover:scale-110 transition-all"
        />
      </div>
      <Transition show={visibleSocials}>
        <div className={` ${itemsClass}`}>
          {shareLinks.map((e) => (
            <TransitionChild
              key={e.id}
              enter={`ease-out  duration-200  transition transform`}
              enterFrom="opacity-0 scale-75 -translate-x-10"
              enterTo="opacity-100 scale-100 translate-x-0"
              leave="ease-in duration-200 transition transform"
              leaveFrom="opacity-100 scale-100 translate-x-0"
              leaveTo="opacity-0 scale-75 -translate-x-10"
            >
              <a
                href={e.link(url)}
                title={"share"}
                target="_blank"
                rel="noreferrer"
              >
                <ContentImage
                  alt=""
                  width={20}
                  height={20}
                  src={e.icon}
                  className={`w-5 h-5 mr-4 opacity-100 hover:opacity-40 cursor-pointer ${itemChildClass}`}
                />
              </a>
            </TransitionChild>
          ))}
          <TransitionChild
            enter={`ease-out  duration-200  transition transform`}
            enterFrom="opacity-0 scale-75 -translate-x-10"
            enterTo="opacity-100 scale-100 translate-x-0"
            leave="ease-in duration-200 transition transform"
            leaveFrom="opacity-100 scale-100 translate-x-0"
            leaveTo="opacity-0 scale-75 -translate-x-10"
          >
            <div onClick={copyLink}>
              <ContentImage
                alt=""
                width={20}
                height={20}
                src={"/assets/icons/share/copy.svg"}
                className={`w-5 h-5 mr-3 opacity-100 hover:opacity-40 cursor-pointer ${itemChildClass}`}
              />
            </div>
          </TransitionChild>
        </div>
      </Transition>
    </div>
  );
};

export default ShareLink;
