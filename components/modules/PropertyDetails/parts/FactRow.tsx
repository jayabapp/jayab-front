import type { FactRowProps } from "@/types/components/modules/property-details";

import { Icon } from "@elements/Icon";

const FactRow = ({ icon, summary, title }: FactRowProps) => {
  const details = summary?.filter(Boolean) ?? [];

  return (
    <div className="flex items-start gap-3">
      <Icon name={icon} size={24} className="mt-0.5 text-neutral-800" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <p className="text-sm font-bold text-neutral-900 md:text-base">
          {title}
        </p>
        {details.length ? (
          <p className="text-xs text-neutral-500 md:text-sm">
            {details.join(" • ")}
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default FactRow;
