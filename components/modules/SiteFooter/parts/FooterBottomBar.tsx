import type { FooterBottomBarProps } from "@/types/components/modules/site-footer";
import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const FooterBottomBar = ({ downloadLinks }: FooterBottomBarProps) => (
  <div className="bg-white padding-x w-full mx-auto shadow-md h-fit lg:h-20 flex flex-col py-2 md:py-0 gap-4 lg:flex-row items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-full text-center text-xxs md:text-sm">
        تمامی حقوق مادی و معنوی این وبسایت متعلق به شرکت
        <Link
          href="/"
          prefetch={false}
          title={_STRINGS.JAYAB}
          className="text-blue-500 underline underline-offset-2"
        >
          &nbsp; جایاب &nbsp;
        </Link>
        میباشد
      </div>
    </div>

    <div className="flex gap-2 items-center">
      {downloadLinks?.map((entry) => (
        <Link
          target="_blank"
          prefetch={false}
          title={entry?.title}
          href={entry?.link || ""}
          referrerPolicy="no-referrer"
          rel="nofollow noopener noreferrer"
          key={`footer-download-${entry?.id}`}
          className="aspect-[3] max-w-[120px]"
        >
          <ContentImage
            width={120}
            height={40}
            sizes="120px"
            src={getHomeImageUrl(entry?.feature_image)}
            alt={entry?.feature_image?.alt || entry?.title || ""}
            className="h-10 object-contain md:max-w-[120px]"
          />
        </Link>
      ))}
    </div>
  </div>
);

export default FooterBottomBar;
