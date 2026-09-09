import type { HeaderContactLinkProps } from "@/types/components/modules/site-header";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const HeaderContactLink = ({
  phone,
  isLight,
  compact = false,
}: HeaderContactLinkProps) => (
  <Link
    href={
      phone
        ? phone.link || `tel:${phone.full_text || phone.small_text || ""}`
        : "/contact-us"
    }
    title={_STRINGS.CONTACT_US}
    className={`icon-parent flex shrink-0 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 ${compact ? "size-8" : "size-9"} ${
      isLight
        ? "border-white/70 bg-white/90 backdrop-blur-[2px]"
        : "border-brand-100 bg-brand-50"
    }`}
  >
    <ContentImage
      alt=""
      width={26}
      height={26}
      src="/assets/icons/header/header_menu_call.svg"
      className={`shake-on-hover ${compact ? "size-6" : "size-7"}`}
    />
  </Link>
);

export default HeaderContactLink;
