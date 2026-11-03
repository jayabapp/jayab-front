import type { CheckboxCardContainerProps } from "@/types/components/elements/form";
import Checkbox from "./Checkbox";

const CheckboxCardContainer = ({
  item,
  title,
  children,
  onSelect,
  isChecked,
  description,
}: CheckboxCardContainerProps) => {
  return (
    <div
      className={`w-full flex flex-col gap-2 rounded-10 border py-2 px-2.5 relative overflow-clip ${
        item?.disabled ? "bg-surface-muted grayscale" : ""
      } `}
    >
      <Checkbox isChecked={isChecked} onSelect={item?.disabled ? () => {} : onSelect} title={title} />
      {!!item?.hint && (
        <p className="-mt-2 leading-3 text-xs opacity-75 font-regular text-ink-subtle ">{item?.hint}</p>
      )}

      <p className="text-xs md:text-sm font-light text-justify content !leading-relaxed">{description}</p>
      <span> {children}</span>
    </div>
  );
};

export default CheckboxCardContainer;
