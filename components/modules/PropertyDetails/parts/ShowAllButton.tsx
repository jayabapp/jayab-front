import type { ShowAllButtonProps } from "@/types/components/modules/property-details";

import { Icon } from "@elements/Icon";

const ShowAllButton = ({ count, label, onClick }: ShowAllButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-fit cursor-pointer items-center gap-1.5 rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
  >
    <span>{label}</span>
    {count ? <span className="text-neutral-600">({count})</span> : <></>}
    <Icon name="chevron-left" size={16} className="text-neutral-600" />
  </button>
);

export default ShowAllButton;
