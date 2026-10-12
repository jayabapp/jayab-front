import { getLocalizedTermsContent } from "@features/home/server/terms-content.server";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import TermsTemplate from "@templates/Terms";
import TermsContent from "@modules/TermsContent";

export const generateMetadata = async (): Promise<Metadata> => {
  const { content, locale } = await getLocalizedTermsContent();
  const t = await getTranslations({ locale, namespace: "common" });
  const metadata = await MehaHeaderHelper(
    content && (locale === "fa" || content.content_locale === locale)
      ? content
      : {
          ...content,
          title: t("terms"),
          full_text: t("termsDescription"),
          seo: {
            ...content?.seo,
            metaTitle: t("terms"),
            metaDescription: t("termsDescription"),
          },
        },
    {
      canonicalUrl: `${process.env.NEXT_PUBLIC_WEB_SITE}/terms`,
    },
  );
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      locale: { fa: "fa_IR", ar: "ar", en: "en_US" }[locale],
    },
  };
};

export const revalidate = 600;

const TermsPage = async () => {
  const { content } = await getLocalizedTermsContent();
  return (
    <TermsTemplate>
      <TermsContent content={content} />
    </TermsTemplate>
  );
};

export default TermsPage;
