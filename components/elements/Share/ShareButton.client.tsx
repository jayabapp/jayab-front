"use client";
import { ContentImage } from "@elements/Image";

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
        await navigator
          .share(shareDetails)
          .then(() => console.log("Your content was shared"));
      } catch {}
    } else {
      Notify({
        type: "warn",
        title: "خطا",
        body: "مرورگر شما این قابلیت را پشتیبانی نمی کند",
      });
    }
  };

  return (
    <ContentImage
      alt=""
      width={16}
      height={16}
      src="/assets/icons/property/share_icon.svg"
      className="w-4 h-4 aspect-square cursor-pointer "
      onClick={() => {
        shareCode();
      }}
    />
  );
};

export default ShareButton;
