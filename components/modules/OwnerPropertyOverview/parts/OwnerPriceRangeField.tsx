import { FormInputWithExternalUnit } from "@elements/Form";
import { useTranslations } from "next-intl";
import { p2e } from "@/helpers/NumberConverter";

import type { OwnerPriceRangeFieldProps } from "@/types/components/modules/owner-property";

import numberWithCommas from "@/helpers/numberWithCommas";
import RangeWithTitle from "@elements/Slider";

const OwnerPriceRangeField = ({
  min,
  max,
  step,
  title,
  value,
  setValue,
}: OwnerPriceRangeFieldProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-3 text-link pt-6 pb-6">
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
        unit={t("common.toman")}
        item={{
          containerClass: "w-full pt-3",
          convertToText: true,
          direction: "ltr",
          isMandatory: false,
          keyboard: "number",
          placeholder: t("owner.tomanPerNight"),
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
};

export default OwnerPriceRangeField;
