import { apiRoutes, baseUrl, NEW_IMAGE_URL } from "@/utils/urls";
import type { ContentDto } from "@/api_services/home/home.interface";
import { getCmsContent } from "@/api_services/home/cms-content.server";
import { REVALIDATE } from "@/helpers/revalidate";
import { JsonLd } from "@elements/StructuredData";

import type { BlogStructuredDataProps, ContentFaqStructuredDataProps, PropertyStructuredDataProps, ServiceStructuredDataProps } from "@/types/features/seo";

import serverCall from "@/helpers/serverCall";
import isEmpty from "lodash/isEmpty";

import type {
  Article,
  BlogPosting,
  FAQPage,
  LocalBusiness,
  Organization,
  Place,
  Product,
  SearchAction,
  Service,
} from "schema-dts";

export const FaqSchema = async () => {
  const { data: faqData } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=faq&per_page=20&page=1`,
    undefined,
    {
      revalidate: REVALIDATE.CMS_PAGE,
    },
  );
  return JsonLd<FAQPage>({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/faq`,
    mainEntity: faqData?.data?.map((e: ContentDto) => ({
      name: e?.title,
      acceptedAnswer: {
        text: e?.full_text || e?.small_text,
        "@type": "Answer",
      },
      "@type": "Question",
    })),
  });
};

export const ServiceSchema = async ({ service }: ServiceStructuredDataProps) => {
  const { data: contactUs }: { data: { data: ContentDto[] } } =
    await serverCall(
      baseUrl +
        apiRoutes.CONTENTS +
        `?key=${"contactUs"}&per_page=20&page=${1}`,
      undefined,
      { revalidate: REVALIDATE.CMS_PAGE },
    );
  const tels = contactUs?.data?.filter((i) => i?.fields?.key == "tel");
  const address = contactUs?.data?.find((i) => i?.fields?.key == "address");

  return JsonLd<Service>({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/services/${service.slug}`,
    description: service.description,
    provider: {
      "@type": "LocalBusiness",
      name: process.env.NEXT_PUBLIC_TITLE,
      priceRange: "200000 - 2000000",
      address: {
        addressLocality: "تهران",
        addressRegion: "ایران",
        postalCode: "{postalCode}",
        addressCountry: "IR",
        streetAddress: address?.small_text,
        "@type": "PostalAddress",
      },
      telephone: tels?.[0]?.small_text,
    },
  });
};

export const SearchboxSchema = () => {
  return JsonLd<SearchAction>({
    "@context": "https://schema.org",
    "@type": "SearchAction",
    name: process.env.NEXT_PUBLIC_TITLE,
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}`,
    potentialAction: {
      "@type": "SearchAction",
      target: `${process.env.NEXT_PUBLIC_WEB_SITE}/products?q={search_term_string}`,
      query: "required name=search_term_string",
    },
  });
};

export const OrganizationSchema = async () => {
  const { data: contactUs }: { data: { data: ContentDto[] } } =
    await serverCall(
      baseUrl +
        apiRoutes.CONTENTS +
        `?key=${"contactUs"}&per_page=20&page=${1}`,
      undefined,
      { revalidate: REVALIDATE.CMS_PAGE },
    );
  const aboutUs = await getCmsContent("aboutUs");
  const socials = contactUs?.data?.filter((e) => e?.fields?.key == "social");
  const tels = contactUs?.data?.filter((i) => i?.fields?.key == "tel");
  const email = contactUs?.data?.find((i) => i?.fields?.key == "email");
  const address = contactUs?.data?.find((i) => i?.fields?.key == "address");
  return JsonLd<Organization>({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_TITLE,
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}`,
    logo: NEW_IMAGE_URL(contactUs?.data?.[0]?.category?.image),
    image: NEW_IMAGE_URL(contactUs?.data?.[0]?.category?.image),
    sameAs: socials?.map((i) => i?.link || i?.small_text),
    contactPoint: tels?.map((i) => ({
      "@type": "ContactPoint",
      availableLanguage: ["Persian"],
      areaServed: "IR",
      contactType: i?.title,
      telephone: i?.small_text,
      email: email?.small_text,
    })),
    address: {
      addressLocality: "تهران",
      addressRegion: "ایران",
      postalCode: "{postalCode}",
      addressCountry: "IR",
      streetAddress: address?.small_text,
      "@type": "PostalAddress",
    },
  });
};
export const LocalBusinessSchema = async () => {
  const { data: contactUs }: { data: { data: ContentDto[] } } =
    await serverCall(
      baseUrl +
        apiRoutes.CONTENTS +
        `?key=${"contactUs"}&per_page=20&page=${1}`,
      undefined,
      { revalidate: REVALIDATE.CMS_PAGE },
    );
  const socials = contactUs?.data?.filter((e) => e?.fields?.key == "social");
  const tels = contactUs?.data?.filter((i) => i?.fields?.key == "tel");
  const email = contactUs?.data?.find((i) => i?.fields?.key == "email");
  const address = contactUs?.data?.find((i) => i?.fields?.key == "address");
  return JsonLd<LocalBusiness>({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: process.env.NEXT_PUBLIC_TITLE,
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}`,
    logo: NEW_IMAGE_URL(contactUs?.data?.[0]?.category?.image),
    priceRange: "200000 - 2000000",
    image: NEW_IMAGE_URL(contactUs?.data?.[0]?.category?.image),
    sameAs: socials?.map((i) => i?.link || i?.small_text),
    telephone: tels?.[0]?.small_text,
    contactPoint: tels?.map((i) => ({
      "@type": "ContactPoint",
      availableLanguage: ["Persian"],
      areaServed: "IR",
      contactType: i?.title,
      telephone: i?.small_text,
      email: email?.small_text,
    })),
    address: {
      addressLocality: "تهران",
      addressRegion: "ایران",
      streetAddress: address?.small_text,
      postalCode: "{postalCode}",
      addressCountry: "IR",
      "@type": "PostalAddress",
    },
  });
};

export const BlogSchema = ({
  data,
  wordCount,
  timeToRead,
}: BlogStructuredDataProps) => {
  return JsonLd<BlogPosting | Article>({
    "@context": "https://schema.org",
    "@type": !!data?.fields?.type?.length ? "BlogPosting" : "Article",
    timeRequired: `PT${timeToRead}M`,
    wordCount: Number(wordCount) || undefined,
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/blog/${data?.slug}`,
    name: data?.title,
    headline: data?.title,
    author: {
      "@type": "Person",
      name: data?.fields?.author,
      url: process.env.NEXT_PUBLIC_WEB_SITE,
    },
    image: [NEW_IMAGE_URL(data?.feature_image)],
    description: data?.small_text,
    dateCreated: data?.created_at,
    dateModified: data?.updated_at,
    datePublished: data?.created_at,
  });
};

export const ProductSchema = ({ data }: PropertyStructuredDataProps) => {
  return JsonLd<Product>({
    "@context": "https://schema.org",
    "@type": "Product",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/rooms/${data?.slug}`,
    image: [NEW_IMAGE_URL(data?.feature_image)],
    name: data?.title,
    offers: {
      "@type": "Offer",
      priceCurrency: "IRR",
      price: data?.daily_price?.today_offer || data?.daily_price?.normal,
      priceValidUntil: getTomorrowDateISO(),
      availability: data?.daily_price
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `${process.env.NEXT_PUBLIC_WEB_SITE}/rooms/${data?.slug}`,
      seller: {
        "@type": "Organization",
        name: "جایاب",
      },
    },
  });
};

export const PlaceSchema = ({ data }: PropertyStructuredDataProps) => {
  return JsonLd<Place>({
    "@context": "https://schema.org",
    "@type": "Room",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/rooms/${data?.slug}`,
    image: [NEW_IMAGE_URL(data?.feature_image)],
    name: data?.title,
  });
};

function getTomorrowDateISO(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0]; // "2026-07-12"
}

export const ContentFAQSchema = async ({ faqData }: ContentFaqStructuredDataProps) => {
  if (isEmpty(faqData)) return;
  return JsonLd<FAQPage>({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/faq`,
    mainEntity: faqData?.map((e: any) => ({
      name: e?.title,
      acceptedAnswer: { text: e?.innerText || e?.innerText, "@type": "Answer" },
      "@type": "Question",
    })),
  });
};
