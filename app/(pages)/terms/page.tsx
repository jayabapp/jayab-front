import { getCmsContent } from "@/api_services/home/cms-content.server";
import { Metadata } from "next";

import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import TermsTemplate from "@templates/Terms";
import TermsContent from "@modules/TermsContent";

export const generateMetadata = async (): Promise<Metadata> =>
  MehaHeaderHelper(await getCmsContent("terms"), {
    canonicalUrl: `${process.env.NEXT_PUBLIC_WEB_SITE}/terms`,
  });

export const revalidate = 600;

const TermsPage = async () => {
  const content = await getCmsContent("terms");
  return <TermsTemplate><TermsContent content={content} /></TermsTemplate>;
};

export default TermsPage;
