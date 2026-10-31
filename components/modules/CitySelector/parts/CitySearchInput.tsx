import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";
import { FormInput } from "@elements/Form";

import type { CitySearchInputProps } from "@/types/components/modules/city-selector";

const CitySearchInput = ({
  onChange,
  options,
  value,
}: CitySearchInputProps) => {
  const t = useTranslations("search");

  return (
    <div className="flex items-center w-full relative">
      <FormInput
        value={value}
        onChangeText={onChange}
        item={{
          containerClass: "relative w-full",
          inputClass: "rounded-full",
          iconUrl: "/assets/icons/edit/magnifier.svg",
          iconUrlClassName: "w-5 !top-[29%] h-5",
          placeholder: options?.placeholder || t("searchDestiny"),
        }}
      />
      <button
        type="button"
        aria-label={t("clearSearch")}
        onClick={() => onChange("")}
        className={`cursor-pointer absolute end-4 z-5 ${
          value ? "opacity-75" : "opacity-0 pointer-events-none"
        } transition-all`}
      >
        <Icon name="x" size={16} />
      </button>
    </div>
  );
};

export default CitySearchInput;
