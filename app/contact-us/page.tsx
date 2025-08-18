import { LocalBusinessSchema } from "@/components/SchemaGenerator/Schemas";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const ContactUsPageHelper = dynamic(() => import("@/components/contactus/ContactUsPageHelper"));
const ContactUsPage = () => {
  return (
    <>
      <LocalBusinessSchema />
      <Suspense>
        {" "}
        <ContactUsPageHelper />
      </Suspense>{" "}
    </>
  );
};

export default ContactUsPage;
