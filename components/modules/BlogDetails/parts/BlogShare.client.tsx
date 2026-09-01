"use client";

import type { BlogShareProps } from "@/types/components/modules/blog";
import { isMobile } from "react-device-detect";
import { useEffect, useState } from "react";

import Button from "@elements/Button";
import Notify from "@elements/Toast";
import Image from "next/image";

const BlogShare = ({ data }: BlogShareProps) => {
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
          <Image
            width={28}
            height={28}
            alt="share"
            className="w-7 h-7 md:w-6 md:h-6"
            src="/assets/icons/blogs/share.svg"
          />
        }
        onClick={onShare}
      />
    </div>
  );
};

export default BlogShare;
