"use client";
import { Transition, TransitionChild } from "@headlessui/react";
import React, { Fragment, useEffect } from "react";
import { useState } from "react";

import Notify from "../Toast";
import { isMobile } from "react-device-detect";
import { shareLinks } from "@/utils/constantss";
// import { ShareNetwork } from "@phosphor-icons/react/dist/ssr";

const ShareLink = ({
  containerClass = "flex-row relative justify-start",
  hasTitle = false,
  itemsClass = "flex items-center ",
  itemChildClass = "",
}) => {
  const [visibleSocials, setvisibleSocials] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const url = window.location.href;
    setUrl(url);
  }, []);
  const onShare = async () => {
    const title = "آلفا آبجکتس";
    const text = "";
    if (isMobile) {
      const shareDetails = { url, title, text };
      if (navigator.share) {
        try {
          await navigator.share(shareDetails).then(() => console.log("Your content was shared"));
        } catch (error) {}
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
        className={`flex items-center  rounded-md   justify-center    cursor-pointer     transition-all dark:bg-opacity-40 ${
          hasTitle && "bg-opacity-60"
        }`}
      >
        <img
          src="/assets/icons/property/share_icon.svg"
          className="cursor-pointer w-5 h-5 grayscale   hover:scale-110 transition-all"
        />
      </div>
      <Transition show={visibleSocials}>
        <div className={` ${itemsClass}`}>
          {shareLinks.map((e, i) => (
            <TransitionChild
              key={e.id}
              enter={`ease-out  duration-200  transition transform`}
              enterFrom="opacity-0 scale-75 -translate-x-10"
              enterTo="opacity-100 scale-100 translate-x-0"
              leave="ease-in duration-200 transition transform"
              leaveFrom="opacity-100 scale-100 translate-x-0"
              leaveTo="opacity-0 scale-75 -translate-x-10"
            >
              <a href={e.link(url)} target="_blank" rel="noreferrer">
                <img
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
              <img
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
