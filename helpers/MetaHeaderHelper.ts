import { NEW_IMAGE_URL } from "@/utils/urls";
import { headers } from "next/headers";

const MetaHeaderHelper = async (data: any, options?: { descriptionLimit?: number }) => {
  const requestHeaders = await headers();
  const xCanonical = await requestHeaders?.get("x-canonical");

  const title = data?.seo?.metaTitle || data?.title;

  // Get the raw description
  let description = data?.property_descriptions?.property_dscr
    ? `${data?.title}-${data?.property_descriptions?.property_dscr}`
    : data?.seo?.metaDescription || data?.full_text || data?.title;

  description = description?.replace(/\n/g, " ")?.replace(/\r/g, "");

  // Trim description if limit is provided
  if (options?.descriptionLimit && description && description.length > options.descriptionLimit) {
    // Find the last space within the limit to avoid cutting words
    const trimmed = description.substring(0, options.descriptionLimit);
    const lastSpaceIndex = trimmed.lastIndexOf(" ");

    // If there's a space, cut there, otherwise cut at the limit
    const cutIndex = lastSpaceIndex > 0 ? lastSpaceIndex : options.descriptionLimit;
    description = description.substring(0, cutIndex).trim() + "...";
  }

  const canonicalUrl = data?.seo?.canonicalURL || xCanonical;
  const ogImage = NEW_IMAGE_URL(data?.feature_image) || "";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEBSITE_URL || "https://jayab.app"),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: title,
      description: description,
      url: canonicalUrl,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
  };
};

export default MetaHeaderHelper;
