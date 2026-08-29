import { Checkbox } from "@elements/Form";
import CmsText from "../shared/CmsText";

const PropTermItem = ({
  isChecked,
  onSelect,
  title,
  desc,
}: {
  desc: string;
  title: string;
  isChecked: boolean;
  onSelect: () => void;
}) => {
  return (
    <div className="flex flex-col gap-3 border  rounded-10  p-2">
      <Checkbox
        title={title}
        onSelect={onSelect}
        isChecked={isChecked}
        rounded="rounded-full"
      />
      <CmsText className="text-xs md:text-sm">{desc}</CmsText>
    </div>
  );
};

export default PropTermItem;
