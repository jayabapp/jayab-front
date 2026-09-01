import { NEW_IMAGE_URL } from "@/utils/urls";
import { ContentImage } from "@/components/elements/Image";
import type { ContactUsItemProps } from "@/types/components/modules/contact-us";

import Editable from "@elements/Editable";
import Link from "next/link";

const ContactUsPageItem = ({ e, disableText = false }: ContactUsItemProps) => {
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
    <Editable contentId={e?.id} className={` w-full `}>
      <Link
        rel="nofollow noopener noreferrer"
        href={link()}
        referrerPolicy="no-referrer"
        target="_blank"
        className={`flex items-center gap-4  rounded-20  border  ${
          (e?.link || e?.small_text) && e?.key !== "address"
            ? "cursor-pointer"
            : ""
        }`}
      >
        {!!e?.attachments[0]?.attachment ? (
          <ContentImage
            width={56}
            height={56}
            sizes="56px"
            alt={e?.attachments[0]?.attachment?.alt || ""}
            src={NEW_IMAGE_URL(e?.attachments[0]?.attachment)}
            className="w-14  h-14 p-2 !object-contain aspect-square "
          />
        ) : (
          <></>
        )}
        {disableText ? (
          <></>
        ) : (
          <p className="text-base bg-white px-2 py-2  rounded-full w-full font-medium ">
            {e?.small_text}
          </p>
        )}
      </Link>
    </Editable>
  );
};

export default ContactUsPageItem;
