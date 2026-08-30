import type { RoomsTemplateProps } from "@/types/components/templates/rooms";
import { PropertyDiscovery } from "@modules/PropertyDiscovery";

const RoomsTemplate = ({ devices }: RoomsTemplateProps) => (
  <PropertyDiscovery devices={devices} />
);

export default RoomsTemplate;
