import type { SingleSelectItemProps } from "@/types/components/elements/form";

import ContentImage from "@elements/Image/ContentImage";

const SingleSelectItem = ({ item, value, onSelect, closeOnSelect, setShow, velueString }: SingleSelectItemProps) => {
  const selected = value === item.id;
  const handleSelect = () => {
    if (selected && !closeOnSelect) onSelect("");
    else onSelect(velueString ? item[velueString] : item.id);
    if (closeOnSelect) setShow?.(false);
  };
  return (
    <button aria-checked={selected} className="relative flex w-full items-center justify-center gap-4 border-t border-neutral-100 py-2 transition-all first:border-t-0" onClick={handleSelect} role="radio" type="button">
      {closeOnSelect ? (
        selected ? <ContentImage alt="" className="absolute right-0 h-4 w-4" height={16} src="/assets/icons/shared/green_check_icon.svg" width={16} /> : null
      ) : (
        <span className={`absolute right-0 flex h-5 w-5 items-center justify-center rounded-md border-2 ${selected ? "border-transparent bg-brand-600" : "border-neutral-300"}`}>
          <span aria-hidden="true" className="text-xs text-white">✓</span>
        </span>
      )}
      <span style={item.hex ? { color: item.hex } : undefined}>{item.title}</span>
    </button>
  );
};

export default SingleSelectItem;
