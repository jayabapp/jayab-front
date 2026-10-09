import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { HeaderContactLinkProps } from "@/types/components/modules/site-header";

import Link from "next/link";

const HeaderContactLink = ({ phone, isLight }: HeaderContactLinkProps) => {
  const t = useTranslations("header");

  return (
    <Link
      href={
        phone
          ? phone.link || `tel:${phone.full_text || phone.small_text || ""}`
          : "/contact-us"
      }
      title={t("contactUs")}
      className={`icon-parent flex shrink-0 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95 size-9 ${
        isLight
          ? "border-white/60 bg-white/35 backdrop-blur-[2px]"
          : "border-brand-100 bg-brand-50"
      }`}
    >
      <ContentImage
        alt=""
        width={26}
        height={26}
        className="shake-on-hover size-7"
        src="/assets/icons/header/header_menu_call.svg"
      />
    </Link>
  );
};

export default HeaderContactLink;
