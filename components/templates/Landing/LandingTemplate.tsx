import type { LandingTemplateProps } from "@/types/components/templates/rooms";
import { LandingDiscovery } from "@modules/PropertyDiscovery";

const LandingTemplate = ({ devices, landing }: LandingTemplateProps) => (
  <LandingDiscovery devices={devices} landing={landing} />
);

export default LandingTemplate;
