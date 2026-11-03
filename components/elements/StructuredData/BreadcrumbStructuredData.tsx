import type { BreadcrumbStructuredDataProps } from "@/types/components/elements/structured-data";
import type { BreadcrumbList } from "schema-dts";
import { JsonLd } from "./StructuredData";

export const BreadCrumbSchema = ({
  breadcrumbs,
}: BreadcrumbStructuredDataProps) =>
  JsonLd<BreadcrumbList>({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs?.map((item, index) => {
      const path = item.route || item.link || "";
      const normalizedPath = path.startsWith("/") ? path : `/${path}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.title,
        item: `${process.env.NEXT_PUBLIC_WEB_SITE}${normalizedPath}`,
      };
    }),
  });
