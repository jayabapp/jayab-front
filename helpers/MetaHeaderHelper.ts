import { NEW_IMAGE_URL } from "@/utils/urls";
import { headers } from "next/headers";

export const normalizeMetaText = (value: unknown) =>
  typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";

export const truncateMetaDescription = (value: string, limit: number) => {
  if (value.length <= limit) return value;
  const ellipsis = "...";
  if (limit <= ellipsis.length) return ellipsis.slice(0, limit);
  const availableLength = limit - ellipsis.length;
  const candidate = value.slice(0, availableLength);
  const lastSpaceIndex = candidate.lastIndexOf(" ");
  const cutIndex = lastSpaceIndex > 0 ? lastSpaceIndex : availableLength;
  return `${candidate.slice(0, cutIndex).trim()}${ellipsis}`;
};

const MetaHeaderHelper = async (
  data: any,
  options?: { descriptionLimit?: number },
) => {
  const requestHeaders = await headers();
  const xCanonical = requestHeaders?.get("x-canonical");
  const title = data?.seo?.metaTitle || data?.title;
  const propertyTitle = normalizeMetaText(data?.title);
  const propertyDescription = normalizeMetaText(
    data?.property_descriptions?.property_dscr,
  );
  const rawDescription = propertyDescription
    ? propertyTitle
      ? `${propertyTitle} - ${propertyDescription}`
      : propertyDescription
    : normalizeMetaText(
        data?.seo?.metaDescription || data?.full_text || data?.title,
      );
  const description = options?.descriptionLimit
    ? truncateMetaDescription(rawDescription, options.descriptionLimit)
    : rawDescription;
  const canonicalUrl = data?.seo?.canonicalURL || xCanonical;
  const ogImage = NEW_IMAGE_URL(data?.feature_image) || "";
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_WEBSITE_URL || "https://jayab.app",
    ),
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
