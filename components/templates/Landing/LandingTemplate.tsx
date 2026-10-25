import { DiscoveryExperience } from "@modules/PropertyDiscovery";
import { LandingContent } from "@modules/PropertyDiscovery";

import type { LandingTemplateProps } from "@/types/components/templates/rooms";

const LandingTemplate = ({
  devices,
  landing,
  baselineFilters,
}: LandingTemplateProps) => (
  <DiscoveryExperience
    mode="landing"
    devices={devices}
    baselineFilters={baselineFilters}
    title={landing?.content?.title ?? ""}
    content={<LandingContent data={landing} />}
  />
);

export default LandingTemplate;
