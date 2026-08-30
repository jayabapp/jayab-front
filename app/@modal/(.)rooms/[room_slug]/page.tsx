import { PropertyDetailsModal } from "@modules/PropertyDetails";

const InterceptedPropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ room_slug: string }>;
}) => {
  const { room_slug } = await params;
  return <PropertyDetailsModal slug={room_slug} />;
};

export default InterceptedPropertyDetailsPage;
