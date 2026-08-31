import { LocalBusinessSchema } from "@/components/SchemaGenerator/Schemas";
import { apiRoutes, baseUrl } from "@/utils/urls";
import { REVALIDATE } from "@/helpers/revalidate";
import { Suspense } from "react";

import serverCall from "@/helpers/serverCall";
import dynamic from "next/dynamic";

const ContactUsPageHelper = dynamic(
  () => import("@/components/contactus/ContactUsPageHelper"),
  { ssr: true },
);
const ContactUsPage = async () => {
  const { data } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"contactUs"}&per_page=20&page=1`,
    undefined,
    {
      revalidate: REVALIDATE.CMS_PAGE,
    },
  );

  return (
    <>
      <Suspense>
        <LocalBusinessSchema />
      </Suspense>
      <Suspense>
        <ContactUsPageHelper data={data} />
      </Suspense>
    </>
  );
};

export default ContactUsPage;
