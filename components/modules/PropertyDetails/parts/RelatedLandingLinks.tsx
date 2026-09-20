import type { RelatedLandingLinksProps } from "@/types/components/modules/property-details";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const LINK_CLASS = "text-brand-600 hover:underline";

const toHref = (url: string) => `/${url.replace(/^\/+/, "")}`;

const RelatedLandingLinks = ({ city, seoLinks }: RelatedLandingLinksProps) => {
  if (!city || (!seoLinks?.villa && !seoLinks?.pool)) return null;

  return (
    <nav
      aria-label={_STRINGS.RELATED_LINKS}
      className="flex flex-wrap gap-x-4 gap-y-2 pb-8 text-sm"
    >
      {seoLinks.villa ? (
        <Link href={toHref(seoLinks.villa)} className={LINK_CLASS}>
          {_STRINGS.RENT_VILLA_IN.replace("{city}", city)}
        </Link>
      ) : null}
      {seoLinks.pool ? (
        <Link href={toHref(seoLinks.pool)} className={LINK_CLASS}>
          {_STRINGS.POOL_VILLA_IN.replace("{city}", city)}
        </Link>
      ) : null}
    </nav>
  );
};

export default RelatedLandingLinks;
