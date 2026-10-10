import { useTranslations } from "next-intl";

import type { RelatedLandingLinksProps } from "@/types/components/modules/property-details";

import Link from "next/link";

const LINK_CLASS = "text-link hover:underline";

const toHref = (url: string) => `/${url.replace(/^\/+/, "")}`;

const RelatedLandingLinks = ({ city, seoLinks }: RelatedLandingLinksProps) => {
  const t = useTranslations("listing");
  if (!city || (!seoLinks?.villa && !seoLinks?.pool)) return null;
  return (
    <nav
      aria-label={t("relatedLinks")}
      className="flex flex-wrap gap-x-4 gap-y-2 pb-8 text-sm"
    >
      {seoLinks.villa ? (
        <Link href={toHref(seoLinks.villa)} className={LINK_CLASS}>
          {t("rentVillaIn").replace("{city}", city)}
        </Link>
      ) : null}
      {seoLinks.pool ? (
        <Link href={toHref(seoLinks.pool)} className={LINK_CLASS}>
          {t("poolVillaIn").replace("{city}", city)}
        </Link>
      ) : null}
    </nav>
  );
};

export default RelatedLandingLinks;
