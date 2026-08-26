"use client";

import { FC, useEffect, useState } from "react";
import { ContentDto } from "@/api_services/home/home.interface";
import { isMobile } from "react-device-detect";

import Button from "../shared/Button/Button";
import Notify from "../shared/Toast";

const BlogShare: FC<{ data: ContentDto }> = ({ data }) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    const getURL = () => {
      const url = window.location.href;
      setUrl(url);
    };
    getURL();
  }, []);

  const onShare = async () => {
    const title = process.env.NEXT_PUBLIC_TITLE || "";
    const text = data?.title || "";
    if (isMobile) {
      const shareDetails = { url, title, text };
      if (navigator.share) {
        try {
          await navigator
            .share(shareDetails)
            .then(() => console.log("Your content was shared"));
        } catch {}
      }
    } else {
      copyLink();
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
    <div className="col-span-1 md:col-span-3 flex flex-row items-center justify-between py-3 border-y">
      <div className="flex flex-row items-center justify-start gap-2">
        <p>این مطلب را اشتراک گذاری کنید:</p>
      </div>
      <Button
        roundedClass="rounded-full"
        icon={
          <img
            className="w-7 h-7 md:w-6 md:h-6"
            alt="share"
            src="/assets/icons/blogs/share.svg"
          />
        }
        onClick={onShare}
      />
    </div>
  );
};

export default BlogShare;
