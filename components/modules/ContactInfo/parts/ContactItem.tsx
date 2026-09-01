import type { ContactUsItemProps } from "@/types/components/modules/contact-us";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { ContentImage } from "@/components/elements/Image";

import Link from "next/link";

const ContactuUItem = ({
  e,
  isShiny,
  textClass,
  disableText = false,
}: ContactUsItemProps) => {
  const link = () => {
    let link = "";
    if (e?.key == "tel" || e?.fields?.key == "tel")
      link = `tel:${e?.small_text}`;
    else if (e?.key == "address" || e?.fields?.key == "address") link = "";
    else if (e?.key == "email" || e?.fields?.key == "email")
      link = `mailTo:${e?.small_text}`;
    else if (e?.link) link = e?.link;
    else if (e?.small_text) link = e?.small_text;
    return link;
  };

  return (
    <Link
      target="_blank"
      href={link() || ""}
      referrerPolicy="no-referrer"
      rel="nofollow noopener noreferrer"
      className={`flex items-center gap-2  ${(e?.link || e?.small_text) && e?.key !== "address" ? "cursor-pointer" : ""}
      ${isShiny ? " bg-gradient-to-br from-white via-transparent to-white rounded-full w-10 h-10  flex items-center justify-center " : ""}
      `}
    >
      {e?.feature_image ? (
        <ContentImage
          width={24}
          height={24}
          sizes="24px"
          alt={e?.feature_image?.alt || ""}
          src={getHomeImageUrl(e?.feature_image)}
          className="w-6 h-6 !object-contain aspect-square "
        />
      ) : (
        <></>
      )}
      {disableText ? (
        <></>
      ) : (
        <p className={`text-base font-medium  ${textClass}`}>{e?.small_text}</p>
      )}
    </Link>
  );
};

export default ContactuUItem;
