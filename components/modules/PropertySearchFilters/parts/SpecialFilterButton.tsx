import { ContentImage } from "@elements/Image";
import { Icon } from "@elements/Icon";

import type { SpecialFilterButtonProps } from "@/types/components/modules/property-search-filters";

const SpecialFilterButton = ({
  cb,
  item,
  isChecked,
}: SpecialFilterButtonProps) => (
  <button
    type="button"
    onClick={cb}
    aria-pressed={isChecked}
    className={`filter-chip ${isChecked ? "filter-chip-active" : "filter-chip-idle"}`}
  >
    <ContentImage
      alt=""
      width={20}
      height={20}
      src={item?.img}
      className="size-5 shrink-0"
    />
    <span>{item?.title}</span>
    {isChecked ? <Icon name="check" size={16} className="text-link" /> : null}
  </button>
);

export default SpecialFilterButton;
