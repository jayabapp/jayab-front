import type { LandingContentProps } from "@/types/components/modules/property-discovery";
import { LandingsContent } from "@modules/HomeContent";

import LandingRelatedTags from "./LandingRelatedTags";
import LandingFaq from "./LandingFaq.client";

const LandingContent = ({ data }: LandingContentProps) => (
  <div className="w-full flex gap-4 flex-col">
    {data?.related_landings ? (
      <LandingRelatedTags data={data?.related_landings} />
    ) : null}
    <LandingsContent
      data={data?.content}
      options={{ parentPadding: "px-2 md:px-[5%]" }}
    />
    {data?.content?.questions ? (
      <LandingFaq data={data?.content?.questions} />
    ) : null}
  </div>
);

export default LandingContent;
