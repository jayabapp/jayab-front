import { headers } from "next/headers";
import React from "react";
const MetaHeaderHelper = async (data: any) => {
  const requestHeaders = await headers();
  const xCanonical = await requestHeaders?.get("x-canonical");
  return {
    title: data?.seo?.metaTitle || data?.title,
    description: data?.seo?.metaDescription || data?.full_text || data?.title,
    alternates: {
      canonical: data?.seo?.canonicalURL || xCanonical,
    },
  };
};

export default MetaHeaderHelper;
