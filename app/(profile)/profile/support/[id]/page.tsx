import { SupportTicketModule } from "@modules/SupportTicket";
import SupportTicketTemplate from "@templates/SupportTicketTemplate";

const SupportTicketPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  return (
    <SupportTicketTemplate>
      <SupportTicketModule ticketId={id} />
    </SupportTicketTemplate>
  );
};

export default SupportTicketPage;
