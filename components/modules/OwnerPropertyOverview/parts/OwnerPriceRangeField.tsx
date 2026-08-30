import type { OwnerPriceRangeFieldProps } from "@/types/components/modules/owner-property";
import { FormInputWithExternalUnit } from "@elements/Form";
import { p2e } from "@/helpers/NumberConverter";

import numberWithCommas from "@/helpers/numberWithCommas";
import RangeWithTitle from "@elements/Slider";
import _STRINGS from "@/utils/LocalStrings";

const OwnerPriceRangeField = ({
  min,
  max,
  step,
  title,
  value,
  setValue,
}: OwnerPriceRangeFieldProps) => (
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
        containerClass: "w-full pt-3",
        convertToText: true,
        direction: "ltr",
        isMandatory: false,
        keyboard: "number",
        placeholder: _STRINGS.TOMAN_PER_NIGHT,
      }}
      value={value ? numberWithCommas(value) : ""}
      onChangeText={(entered) => {
        const pureValue = p2e(`${entered}`)
          .replaceAll(",", "")
          .replaceAll(" ", "");
        if (!isNaN(Number(pureValue))) setValue(Number(pureValue));
      }}
    />
  </div>
);

export default OwnerPriceRangeField;
