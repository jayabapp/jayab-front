import type { TitledCounterProps } from "@/types/components/modules/owner-property";
import { Counter } from "@elements/Form";

const TitledCounter = ({
  title,
  value,
  onChange,
  disableInput,
}: TitledCounterProps) => (
  <div className="flex items-center justify-between w-full">
    <p className="text-sm w-full">{title}</p>
    <div className="w-[40%]">
      <Counter
        value={value}
        plusMinusNumber={1}
        setValue={onChange}
        items={{ disableInput }}
      />
    </div>
  </div>
);

export default TitledCounter;
