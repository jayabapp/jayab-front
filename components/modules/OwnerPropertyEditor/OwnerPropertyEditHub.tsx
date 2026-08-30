import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";
import { createPropertySteps } from "@/utils/constantss";
import { ContentImage } from "@elements/Image";

import Link from "next/link";

const OwnerPropertyEditHub = ({ propertyId }: OwnerPropertyRouteProps) => (
  <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-2">
    {createPropertySteps(Number(propertyId))?.map((step) => (
      <Link
        href={`${step?.link}`}
        title={step?.full_title}
        key={`editStep${step?.id}`}
        className="w-full border-neutral-200 flex items-center justify-between h-fit px-4 py-3 rounded-10 border"
      >
        <p className="text-sm font-bold">{step?.full_title}</p>
        <ContentImage
          alt=""
          width={16}
          height={16}
          className="rotate-90"
          src="/assets/icons/shared/chevron.svg"
        />
      </Link>
    ))}
  </div>
);

export default OwnerPropertyEditHub;
