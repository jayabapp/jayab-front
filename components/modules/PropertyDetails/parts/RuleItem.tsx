import type { RuleItemProps } from "@/types/components/modules/property-details";

import { Icon } from "@elements/Icon";

const RuleItem = ({ allowed, description, label }: RuleItemProps) => (
  <div className="flex items-start gap-2.5">
    <Icon
      size={20}
      name={allowed ? "check" : "x"}
      className={`mt-0.5 ${allowed ? "text-success-600" : "text-danger-500"}`}
    />
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="text-sm text-neutral-800">{label}</p>
      {description ? (
        <p className="whitespace-pre-wrap text-xs text-neutral-500">
          {description}
        </p>
      ) : (
        <></>
      )}
    </div>
  </div>
);

export default RuleItem;
