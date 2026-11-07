import { getServerContentList } from "@features/home/server/home.server";
import { LocalBusinessSchema } from "@features/seo/components/Schemas";
import { resolveLocale } from "@/i18n/config";
import { getLocale } from "next-intl/server";

import ContactUsTemplate from "@templates/ContactUs";
import ContactInfo from "@modules/ContactInfo";

const ContactUsPage = async () => {
  const locale = resolveLocale(await getLocale());
  const { data } = await getServerContentList(
    "contactUs",
    1,
    20,
    false,
    locale,
  );
  return (
    <ContactUsTemplate schema={<LocalBusinessSchema />}>
      <ContactInfo data={data} />
    </ContactUsTemplate>
  );
};

export default ContactUsPage;
