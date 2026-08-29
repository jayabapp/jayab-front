import { p2e } from "@/helpers/NumberConverter";

import { FormInputWithExternalUnit } from "@elements/Form";
import numberWithCommas from "@/helpers/numberWithCommas";
import RangeWithTitle from "@elements/Slider";
import _STRINGS from "@/utils/LocalStrings";

export type TPriceRangeProps = {
  min: number;
  max: number;
  step: number;
  title: string;
  value: number;
  setValue: (e: number) => void;
};

const PriceRangeField = ({
  title,
  value,
  setValue,
  min,
  max,
  step,
}: TPriceRangeProps) => {
  return (
    <div className="flex flex-col gap-3 text-brand-600 pt-6 pb-6">
      <div className="flex items-center justify-between">
        <span>{title}</span>
        <span>{numberWithCommas(value)}</span>
      </div>
      <RangeWithTitle
        max={max}
        min={min}
        step={step}
        value={value}
        setValue={setValue}
      />
      <FormInputWithExternalUnit
        unit={_STRINGS.TOMAN}
        item={{
          isMandatory: false,
          containerClass: "w-full pt-3",
          keyboard: "number",
          convertToText: true,
          direction: "ltr",
          placeholder: _STRINGS.TOMAN_PER_NIGHT,
        }}
        value={!!value ? numberWithCommas(value) : ""}
        onChangeText={(e) => {
          const pureVal = p2e(`${e}`).replaceAll(",", "").replaceAll(" ", "");
          if (!isNaN(Number(pureVal))) setValue(Number(pureVal));
        }}
      />
    </div>
  );
};

export default PriceRangeField;
