import type { MultiSelectItemProps } from "@/types/components/elements/form";

const MultiSelectItem = ({ item, value, onSelect, closeOnSelect, setShow, full_item }: MultiSelectItemProps) => {
  const selected = value.some((entry) => entry === item.id || entry?.id === item.id);
  const handleSelect = () => {
    onSelect(full_item ? item : item.id);
    if (closeOnSelect) setShow?.(false);
  };
  return (
    <button aria-checked={selected} className="flex w-full items-center gap-4 border-t border-neutral-100 py-2 transition-all" onClick={handleSelect} role="checkbox" type="button">
      <span className={`flex h-5 w-5 items-center justify-center rounded-md border-2 ${selected ? "border-transparent bg-brand-600" : "border-neutral-300"}`}>
        <span aria-hidden="true" className="text-xs text-white">✓</span>
      </span>
      <span style={item.hex ? { color: item.hex } : undefined}>{item.title}</span>
    </button>
  );
};

export default MultiSelectItem;
