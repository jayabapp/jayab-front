import { Icon } from "@elements/Icon";

import type { ShowAllButtonProps } from "@/types/components/modules/property-details";

const ShowAllButton = ({ count, label, onClick }: ShowAllButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-surface-muted px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
  >
    <span>{label}</span>
    {count ? <span className="text-ink-muted">({count})</span> : <></>}
    <Icon name="chevron-left" size={16} className="text-ink-muted ltr:rotate-180" />
  </button>
);

export default ShowAllButton;
