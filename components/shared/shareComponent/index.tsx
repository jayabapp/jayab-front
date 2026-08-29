"use client";
import React from "react";
import Notify from "@elements/Toast";

const ShareButton = () => {
  const shareCode = async () => {
    const title = "جایاب";
    const text = `
     فروشگاه ${title}:
    🔵 code: ${window?.location?.href}
    
    ✅https://pwa.zeinabiyetehran.com 
    `;

    const shareDetails = { title, text };

    if (navigator.share) {
      try {
        await navigator.share(shareDetails).then(() => console.log("Your content was shared"));
      } catch (error) {
        // alert(`Oops! I couldn't share to the world because: ${error}`);
      }
    } else {
      Notify({ type: "warn", title: "خطا", body: "مرورگر شما این قابلیت را پشتیبانی نمی کند" });
    }
  };

  return (
    <img
      src="/assets/icons/property/share_icon.svg"
      onClick={() => {
        shareCode();
      }}
      className="w-4 h-4 aspect-square cursor-pointer "
    />
  );
};

export default ShareButton;
