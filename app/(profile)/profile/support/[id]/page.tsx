import { SupportTicketModule } from "@modules/SupportTicket";
import SupportTicketTemplate from "@templates/SupportTicketTemplate";
import IntlNamespaces from "@/i18n/IntlNamespaces";

const SupportTicketPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return (
    <IntlNamespaces namespaces={["profile", "validation"]}>
      <SupportTicketTemplate>
        <SupportTicketModule ticketId={id} />
      </SupportTicketTemplate>
    </IntlNamespaces>
  );
};

export default SupportTicketPage;
