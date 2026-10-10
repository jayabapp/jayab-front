import { getHomeImageUrl } from "@features/home/mappers/home-image.mapper";
import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { FooterBottomBarProps } from "@/types/components/modules/site-footer";

import Link from "next/link";

const FooterBottomBar = ({ downloadLinks }: FooterBottomBarProps) => {
  const tc = useTranslations("common");
  const t = useTranslations("footer");

  return (
    <div className="bg-white padding-x w-full mx-auto shadow-md h-fit lg:h-20 flex flex-col py-2 md:py-0 gap-4 lg:flex-row items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-full text-center text-xxs md:text-sm">
          {t.rich("copyright", {
            link: (chunks) => (
              <Link
                href="/"
                prefetch={false}
                title={tc("jayab")}
                className="text-blue-500 underline underline-offset-2"
              >
                {chunks}
              </Link>
            ),
          })}
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
              className="h-10 object-contain md:max-w-[120px]"
              alt={entry?.feature_image?.alt || entry?.title || ""}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FooterBottomBar;
