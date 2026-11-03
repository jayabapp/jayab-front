import { getCmsContent } from "@/api_services/home/cms-content.server";
import { LocalBusinessSchema } from "@features/seo/components/Schemas";
import { resolveLocale } from "@/i18n/config";
import { getLocale } from "next-intl/server";

import AboutUsContent from "@modules/AboutUsContent";
import AboutUsTemplate from "@templates/AboutUs";

const AboutUsPage = async () => {
  const content = await getCmsContent("aboutUs", resolveLocale(await getLocale()));
  return <AboutUsTemplate schema={<LocalBusinessSchema />}><AboutUsContent content={content} /></AboutUsTemplate>;
};

export default AboutUsPage;
