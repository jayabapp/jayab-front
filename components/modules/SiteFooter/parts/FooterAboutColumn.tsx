import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { BrandTitle } from "@elements/BrandTitle";

import type { FooterAboutColumnProps } from "@/types/components/modules/site-footer";

import FooterSocialRow from "./FooterSocialRow";
import CmsText from "@elements/CmsText";
import Link from "next/link";

const FooterAboutColumn = ({ about, socials }: FooterAboutColumnProps) => {
  const t = useTranslations("common");

  return (
    <div className="col-span-4 lg:col-span-2 flex w-full flex-col justify-between gap-6 h-fit order-2 lg:order-1">
      <Link
        href="/"
        prefetch={false}
        title={t("jayab")}
        referrerPolicy="no-referrer"
        className="flex items-center gap-4 justify-start"
      >
        <ContentImage
          alt=""
          width={40}
          height={40}
          className="size-10"
          src="/assets/icons/logo/mark.svg"
        />
        <BrandTitle tone="white" className="h-6 w-auto" />
      </Link>

      <CmsText
        whitespace="normal"
        className="break-words text-sm leading-6 opacity-100 line-clamp-4"
      >
        {about ? about?.small_text || about?.full_text : ""}
      </CmsText>

      <FooterSocialRow
        socials={socials}
        className="hidden md:flex justify-center md:justify-start mt-3 gap-2 mb-4"
      />
    </div>
  );
};

export default FooterAboutColumn;
