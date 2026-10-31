import { createPropertySteps } from "@/utils/constantss";
import { Icon } from "@elements/Icon";
import { useTranslations } from "next-intl";

import type { OwnerPropertyRouteProps } from "@/types/components/modules/owner-property";

import Link from "next/link";

const OwnerPropertyEditHub = ({ propertyId }: OwnerPropertyRouteProps) => {
  const t = useTranslations();

  return (
    <div className="w-full grid grid-cols-1 gap-2 md:grid-cols-2">
      {createPropertySteps(Number(propertyId), t)?.map((step) => (
        <Link
          href={`${step?.link}`}
          title={step?.full_title}
          key={`editStep${step?.id}`}
          className="w-full border-line flex items-center justify-between h-fit px-4 py-3 rounded-10 border"
        >
          <p className="text-sm font-bold">{step?.full_title}</p>
          <Icon name="chevron-end" size={16} />
        </Link>
      ))}
    </div>
  );
};

export default OwnerPropertyEditHub;
