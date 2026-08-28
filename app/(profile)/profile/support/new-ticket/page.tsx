import { SupportCreateModule } from "@modules/SupportCreate";
import SupportTemplate from "@templates/SupportTemplate";

const NewTicket = () => (
  <SupportTemplate>
    <SupportCreateModule dataKey="TICKET" />
  </SupportTemplate>
);

export default NewTicket;
