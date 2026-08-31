import { PropertyDetailsModal } from "@modules/PropertyDetails";
import { SiteFooter } from "@modules/SiteFooter";
import { SiteHeader } from "@modules/SiteHeader";

const InterceptedPropertyDetailsPage = async ({
  params,
}: {
  params: Promise<{ room_slug: string }>;
}) => {
  const { room_slug } = await params;

  return (
    <PropertyDetailsModal
      slug={room_slug}
      footer={<SiteFooter />}
      header={<SiteHeader variant="modal" />}
    />
  );
};

export default InterceptedPropertyDetailsPage;
