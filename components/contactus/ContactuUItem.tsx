import { ContentDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import React from "react";
import { useRouter } from "next/navigation";
const ContactuUItem = ({
  e,
  disableText = false,
  textClass,
}: {
  e: ContentDto;
  disableText?: boolean;
  textClass?: string;
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        let link = "";
        if (e?.key == "tel" || e?.fields?.key == "tel") {
          link = `tel:${e?.small_text}`;
        } else if (e?.key == "address" || e?.fields?.key == "address") {
          link = "";
        } else if (e?.key == "email" || e?.fields?.key == "address") {
          window.open(`mailTo:${e?.small_text}`);
        } else if (e?.link) {
          link = e?.link;
        } else if (e?.small_text) {
          link = e?.small_text;
        }
        if (link) window.open(link, "_blank", "noopener,noreferrer");
      }}
      className={`flex items-center gap-2  ${
        (e?.link || e?.small_text) && e?.key !== "address" ? "cursor-pointer" : ""
      }`}
    >
      {e?.feature_image ? (
        <img
          className="w-6 h-6 !object-contain aspect-square "
          src={NEW_IMAGE_URL(e?.feature_image)}
          alt={e?.feature_image?.alt || ""}
        />
      ) : (
        <></>
      )}
      {disableText ? <></> : <p className={`text-base font-medium dark:text-zinc-100 ${textClass}`}>{e?.small_text}</p>}
    </div>
  );
};

export default ContactuUItem;
