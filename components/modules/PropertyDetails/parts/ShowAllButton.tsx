import { Icon } from "@elements/Icon";

import type { ShowAllButtonProps } from "@/types/components/modules/property-details";

const ShowAllButton = ({ label, onClick }: ShowAllButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 w-fit cursor-pointer items-center gap-1.5 rounded-full border border-line-strong bg-surface px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
  >
    <span>{label}</span>
    <Icon
      size={16}
      name="chevron-left"
      className="text-ink-muted ltr:rotate-180"
    />
  </button>
);

export default ShowAllButton;
