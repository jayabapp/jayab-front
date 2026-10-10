import type { FieldCharacterCounterProps } from "@/types/components/modules/owner-property";

const FieldCharacterCounter = ({
  max,
  value,
  containerClass,
}: FieldCharacterCounterProps) => (
  <div
    className={`absolute left-2 text-xs text-ink-subtle bottom-0 ${containerClass ?? ""}`}
  >
    {max - `${value}`?.length}/{max}
  </div>
);

export default FieldCharacterCounter;
