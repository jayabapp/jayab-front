import { LocalBusinessSchema } from "@/components/SchemaGenerator/Schemas";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { apiRoutes, baseUrl } from "@/utils/urls";
import serverCall from "@/helpers/serverCall";

const ContactUsPageHelper = dynamic(() => import("@/components/contactus/ContactUsPageHelper"), { ssr: true });
const ContactUsPage = async () => {
  const { data } = await serverCall(baseUrl + apiRoutes.CONTENTS + `?key=${"contactUs"}&per_page=20&page=1`);

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
