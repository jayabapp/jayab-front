import { NEW_IMAGE_URL } from "@/utils/urls";
import { headers } from "next/headers";

const MetaHeaderHelper = async (data: any) => {
  const requestHeaders = await headers();
  const xCanonical = await requestHeaders?.get("x-canonical");

  const title = data?.seo?.metaTitle || data?.title;
  const description = data?.seo?.metaDescription || data?.full_text || data?.title;
  const canonicalUrl = data?.seo?.canonicalURL || xCanonical;
  const ogImage = NEW_IMAGE_URL(data?.feature_image) || "";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      image: ogImage || undefined,
    },
  };
};

export default MetaHeaderHelper;
