import type { StructuredDataProps } from "@/types/components/elements/structured-data";
import type { Thing, WithContext } from "schema-dts";

const serializeJsonLd = (value: unknown) =>
  JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026");

const SchemaGenerator = ({ data }: StructuredDataProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": data?.type,
    name: data?.name,
    url: data?.url || process.env.NEXT_PUBLIC_WEB_SITE,
    image: data?.image,
    description: data?.description,
    ...data?.others,
  };
  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
    </section>
  );
};

export const JsonLd = <T extends Thing>(json: WithContext<T>) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: serializeJsonLd(json) }}
  />
);

export default SchemaGenerator;
