import type { LandingContentProps } from "@/types/components/modules/property-discovery";
import { LandingsContent } from "@modules/HomeContent";

import LandingRelatedTags from "./LandingRelatedTags";
import LandingFaq from "./LandingFaq.client";

const CONTENT_INSET_CLASS = "px-2 md:px-[5%]";

const LandingContent = ({ data }: LandingContentProps) => (
  <div className="w-full flex gap-4 flex-col">
    {data?.related_landings ? (
      <div className={CONTENT_INSET_CLASS}>
        <LandingRelatedTags data={data?.related_landings} />
      </div>
    ) : null}
    <LandingsContent
      data={data?.content}
      options={{ parentPadding: CONTENT_INSET_CLASS }}
    />
    {data?.content?.questions ? (
      <div className={CONTENT_INSET_CLASS}>
        <LandingFaq data={data?.content?.questions} />
      </div>
    ) : null}
  </div>
);

export default LandingContent;
