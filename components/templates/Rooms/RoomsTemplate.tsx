import { DiscoveryExperience } from "@modules/PropertyDiscovery";

import type { RoomsTemplateProps } from "@/types/components/templates/rooms";

const RoomsTemplate = ({ devices, title }: RoomsTemplateProps) => (
  <DiscoveryExperience mode="search" title={title} devices={devices} />
);

export default RoomsTemplate;
