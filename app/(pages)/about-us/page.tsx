import { getCmsContent } from "@/api_services/home/cms-content.server";
import { LocalBusinessSchema } from "@features/seo/components/Schemas";

import AboutUsContent from "@modules/AboutUsContent";
import AboutUsTemplate from "@templates/AboutUs";

const AboutUsPage = async () => {
  const content = await getCmsContent("aboutUs");
  return <AboutUsTemplate schema={<LocalBusinessSchema />}><AboutUsContent content={content} /></AboutUsTemplate>;
};

export default AboutUsPage;
