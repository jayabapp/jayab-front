import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getServerPropertyDetail } from "@features/properties/server/property.server";
import { propertyDetailOptions } from "@features/properties/api/property.options";
import { ProductSchema } from "@/components/SchemaGenerator/Schemas";
import { PlaceSchema } from "@/components/SchemaGenerator/Schemas";
import { redirect } from "next/navigation";

import PropertyDetailsTemplate from "@templates/PropertyDetails";
import deviceTypeDetector from "@/helpers/device.detector";
import MehaHeaderHelper from "@/helpers/MetaHeaderHelper";
import getQueryClient from "@lib/query/query-client";

import type { Metadata } from "next";

type PropertyDetailsPageProps = {
  params: Promise<{ room_slug: string }>;
};

export const generateMetadata = async ({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> => {
  const { room_slug } = await params;
  const { data: property } = await getServerPropertyDetail(room_slug);
  return MehaHeaderHelper(property, { descriptionLimit: 160 });
};

const PropertyDetailsPage = async ({ params }: PropertyDetailsPageProps) => {
  const { room_slug } = await params;
  const [{ data: property }, devices] = await Promise.all([
    getServerPropertyDetail(room_slug),
    deviceTypeDetector(),
  ]);

  if (property?.slug && decodeURI(property.slug) !== decodeURI(room_slug))
    redirect(`/rooms/${encodeURI(property.slug)}`);
  const queryClient = getQueryClient();
  queryClient.setQueryData(propertyDetailOptions(room_slug).queryKey, property);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertyDetailsTemplate
        devices={devices}
        property={property}
        schema={
          <>
            <ProductSchema data={property} />
            <PlaceSchema data={property} />
          </>
        }
      />
    </HydrationBoundary>
  );
};

export default PropertyDetailsPage;
