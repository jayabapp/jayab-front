import type { PropertyTermOptionProps } from "@/types/components/modules/owner-property";
import { Checkbox } from "@elements/Form";

import CmsText from "@/components/shared/CmsText";

const PropertyTermOption = ({
  desc,
  title,
  onSelect,
  isChecked,
}: PropertyTermOptionProps) => (
  <div className="flex flex-col gap-3 border rounded-10 p-2">
    <Checkbox
      title={title}
      onSelect={onSelect}
      isChecked={isChecked}
      rounded="rounded-full"
    />
    <CmsText className="text-xs md:text-sm">{desc}</CmsText>
  </div>
);

export default PropertyTermOption;
