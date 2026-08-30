import type { LandingRelatedTagsProps } from "@/types/components/modules/property-discovery";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const LandingRelatedTags = ({ data }: LandingRelatedTagsProps) => (
  <div className="w-full flex flex-col gap-2">
    <div className="flex items-center gap-1">
      <ContentImage
        alt=""
        width={16}
        height={16}
        className="w-4 h-4 aspect-square"
        src="/assets/icons/property/blue_link.svg"
      />
      <p className="text-sm font-medium">{_STRINGS.RELATED_RESULTS}</p>
    </div>
    <div className="flex flex-wrap gap-2 w-full">
      {data?.map((landing) => (
        <Link
          prefetch={false}
          href={landing?.url}
          title={landing?.title}
          key={`related-${landing?.url}`}
          className="w-fit border-neutral-400 py-1 px-1.5 border-2 rounded-full flex items-center gap-2"
        >
          <p className="text-neutral-400 text-sm">{landing?.title}</p>
          <span className="w-4 h-4 aspect-square flex items-center justify-center">
            <ContentImage
              alt=""
              width={12}
              height={12}
              className="w-3 h-3"
              src="/assets/icons/shared/upper_left_arrow.svg"
            />
          </span>
        </Link>
      ))}
    </div>
  </div>
);

export default LandingRelatedTags;
