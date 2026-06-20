import { ContentDto } from "@/api_services/home/home.interface";
import { NEW_IMAGE_URL } from "@/utils/urls";
import Link from "next/link";
const ContactuUItem = ({
  e,
  disableText = false,
  textClass,
  isShiny,
}: {
  e: ContentDto;
  disableText?: boolean;
  isShiny?: boolean;
  textClass?: string;
}) => {
  const link = () => {
    let link = "";
    if (e?.key == "tel" || e?.fields?.key == "tel") {
      link = `tel:${e?.small_text}`;
    } else if (e?.key == "address" || e?.fields?.key == "address") {
      link = "";
    } else if (e?.key == "email" || e?.fields?.key == "email") {
      link = `mailTo:${e?.small_text}`;
    } else if (e?.link) {
      link = e?.link;
    } else if (e?.small_text) {
      link = e?.small_text;
    }
    return link;
  };

  return (
    <Link
      rel="nofollow noopener noreferrer"
      href={link() || ""}
      target="_blank"
      referrerPolicy="no-referrer"
      className={`flex items-center gap-2  ${(e?.link || e?.small_text) && e?.key !== "address" ? "cursor-pointer" : ""}
      ${isShiny ? " bg-gradient-to-br from-white via-transparent to-white rounded-full w-10 h-10  flex items-center justify-center " : ""}
      `}
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
    </Link>
  );
};

export default ContactuUItem;
