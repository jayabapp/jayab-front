import { Thing, WithContext } from "schema-dts";

const SchemaGenerator = ({
  data,
}: {
  data: {
    name?: string;
    type: string;
    url?: string;
    image?: string[];
    description?: string;
    others?: { [key: string]: any };
  };
}) => {
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
      {/* Add JSON-LD to your page */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ... */}
    </section>
  );
};

export function JsonLd<T extends Thing>(json: WithContext<T>): any {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />;
}

export default SchemaGenerator;
