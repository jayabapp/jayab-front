import { LocalBusinessSchema } from "@features/seo/components/Schemas";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { REVALIDATE } from "@/helpers/revalidate";

import ContactUsTemplate from "@templates/ContactUs";
import ContactInfo from "@modules/ContactInfo";
import serverCall from "@/helpers/serverCall";

const ContactUsPage = async () => {
  const { data } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + "?key=contactUs&per_page=20&page=1",
    undefined,
    { revalidate: REVALIDATE.CMS_PAGE },
  );
  return (
    <ContactUsTemplate schema={<LocalBusinessSchema />}>
      <ContactInfo data={data} />
    </ContactUsTemplate>
  );
};

export default ContactUsPage;
