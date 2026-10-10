import { Icon } from "@elements/Icon";

import type { RuleItemProps } from "@/types/components/modules/property-details";

const RuleItem = ({ allowed, description, label }: RuleItemProps) => (
  <div className="flex items-start gap-2.5">
    <Icon
      size={20}
      name={allowed ? "check" : "x"}
      className={`mt-0.5 ${allowed ? "text-status-success" : "text-status-danger"}`}
    />
    <div className="flex min-w-0 flex-col gap-0.5">
      <p className="ui-body text-ink">{label}</p>
      {description ? (
        <p className="whitespace-pre-wrap ui-caption text-ink-subtle">
          {description}
        </p>
      ) : (
        <></>
      )}
    </div>
  </div>
);

export default RuleItem;
