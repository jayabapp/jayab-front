"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { isMobile } from "react-device-detect";

import type { BlogShareProps } from "@/types/components/modules/blog";

import Notify from "@elements/Toast";
import Image from "next/image";

const BlogShare = ({ data }: BlogShareProps) => {
  const t = useTranslations("content");
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
          await navigator.share(shareDetails);
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
      body: t("blogLinkCopied"),
    });
  };

  return (
    <button
      type="button"
      onClick={() => void onShare()}
      title={t("blogShare")}
      className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-600 transition-colors hover:bg-brand-100"
    >
      <Image
        alt=""
        width={16}
        height={16}
        className="h-4 w-4"
        src="/assets/icons/blogs/share.svg"
      />
      {t("blogShare")}
    </button>
  );
};

export default BlogShare;
