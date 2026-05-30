import { Category, ContentDto } from "@/api_services/home/home.interface";
import { SinglePropDto } from "@/api_services/property/property.interface";
import serverCall from "@/helpers/serverCall";
import { apiRoutes, baseUrl, NEW_IMAGE_URL } from "@/utils/urls";
import { isEmpty } from "lodash";
import { FC } from "react";
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  FAQPage,
  LocalBusiness,
  Organization,
  Place,
  Product,
  SearchAction,
  Service,
} from "schema-dts";
import { JsonLd } from ".";
export const FaqSchema = async () => {
  const { data: faqData } = await serverCall(baseUrl + apiRoutes.CONTENTS + `?key=faq&per_page=20&page=1`);
  return JsonLd<FAQPage>({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/faq`,
    mainEntity: faqData?.data?.map((e: ContentDto) => ({
      name: e?.title,
      acceptedAnswer: { text: e?.full_text || e?.small_text, "@type": "Answer" },
      "@type": "Question",
    })),
  });
};

export const ServiceSchema = async ({ service }: { service: Category }) => {
  const { data: contactUs }: { data: { data: ContentDto[] } } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"contactUs"}&per_page=20&page=${1}`,
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
  const { data: contactUs }: { data: { data: ContentDto[] } } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"contactUs"}&per_page=20&page=${1}`,
  );
  const { data: aboutUs }: { data: ContentDto } = await serverCall(baseUrl + apiRoutes.CONTENT_BY_KEY("aboutUs"));
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
  const { data: contactUs }: { data: { data: ContentDto[] } } = await serverCall(
    baseUrl + apiRoutes.CONTENTS + `?key=${"contactUs"}&per_page=20&page=${1}`,
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

/* -------------------------------------------------------------------------- */
/*                                    BLOG                                    */
/* -------------------------------------------------------------------------- */

export const BlogSchema = ({
  data,
  wordCount,
  timeToRead,
}: {
  data: ContentDto;
  wordCount: number;
  timeToRead: number;
}) => {
  return JsonLd<BlogPosting | Article>({
    "@context": "https://schema.org",
    "@type": !!data?.fields?.type?.length ? "BlogPosting" : "Article",
    timeRequired: `PT${timeToRead}M`,
    wordCount: Number(wordCount) || undefined,
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/blog/${data?.slug}`,
    name: data?.title,
    headline: data?.title,
    author: { "@type": "Person", name: data?.fields?.author, url: process.env.NEXT_PUBLIC_WEB_SITE },
    image: [NEW_IMAGE_URL(data?.feature_image)],
    description: data?.small_text,
    dateCreated: data?.created_at,
    dateModified: data?.updated_at,
    datePublished: data?.created_at,
  });
};

/* -------------------------------------------------------------------------- */
/*                                    PRODUCT                                    */
/* -------------------------------------------------------------------------- */

export const ProductSchema = ({ data }: { data: SinglePropDto }) => {
  return JsonLd<Product>({
    "@context": "https://schema.org",
    "@type": "Product",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/rooms/${data?.slug}`,
    image: [NEW_IMAGE_URL(data?.feature_image)],
    name: data?.title,

    // description: data?.,
    // alternateName: data?.title_en || "",
    // brand: data?.category?.title,

    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: data?.rate,
    //   reviewCount: data?.rate_count,
    // },

    offers: [
      {
        "@type": "Offer",
        priceCurrency: "IRR",
        price: data?.daily_price?.today_offer || data?.daily_price?.normal,
      },
    ],
  });
};

/* -------------------------------------------------------------------------- */
/*                                    PLACE                                   */
/* -------------------------------------------------------------------------- */
export const PlaceSchema = ({ data }: { data: SinglePropDto }) => {
  return JsonLd<Place>({
    "@context": "https://schema.org",
    "@type": "Room",
    url: `${process.env.NEXT_PUBLIC_WEB_SITE}/rooms/${data?.slug}`,
    image: [NEW_IMAGE_URL(data?.feature_image)],
    name: data?.title,
    // description: data?.,
    // alternateName: data?.title_en || "",
    // brand: data?.category?.title,

    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: data?.rate,
    //   reviewCount: data?.rate_count,
    // },

    // offers: [
    //   {
    //     "@type": "Offer",
    //     priceCurrency: "IRR",
    //     price: data?.cheapest_price?.discounted_price || data?.cheapest_price?.price,
    //     availability: data?.cheapest_price ? "InStock" : "OutOfStock",
    //   },
    // ],
  });
};

export const BreadCrumbSchema = ({
  breadcrumbs,
}: {
  breadcrumbs: { title: string; link?: string; route?: string }[];
}) => {
  return JsonLd<BreadcrumbList>({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs?.map((e, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: e?.title,
      item: `${process.env.NEXT_PUBLIC_WEB_SITE}${
        !!e?.route
          ? e?.route?.startsWith("/")
            ? e?.route
            : "/" + e?.route
          : e?.link
            ? e?.link?.startsWith("/")
              ? e?.link
              : "/" + e?.link
            : "/"
      }`,
    })),
  });
};

export const ContentFAQSchema: FC<{ faqData: { title: string; innerText: string }[] }> = async ({ faqData }) => {
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
