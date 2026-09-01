import type { FooterAboutColumnProps } from "@/types/components/modules/site-footer";
import { ContentImage } from "@elements/Image";

import FooterSocialRow from "./FooterSocialRow";
import _STRINGS from "@/utils/LocalStrings";
import CmsText from "@elements/CmsText";
import Link from "next/link";

const FooterAboutColumn = ({ about, socials }: FooterAboutColumnProps) => (
  <div className="col-span-4 lg:col-span-2 flex w-full flex-col justify-between gap-6 h-fit order-2 lg:order-1">
    <Link
      href="/"
      prefetch={false}
      title={_STRINGS.JAYAB}
      referrerPolicy="no-referrer"
      className="flex items-center gap-4 justify-start"
    >
      <ContentImage
        width={128}
        height={40}
        alt="footer_logo"
        className="w-fit max-w-32 h-auto"
        src="/assets/icons/logo/header_logo.svg"
      />
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

export default FooterAboutColumn;
