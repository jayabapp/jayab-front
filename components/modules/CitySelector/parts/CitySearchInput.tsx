import type { CitySearchInputProps } from "@/types/components/modules/city-selector";

import { ContentImage } from "@elements/Image";
import { FormInput } from "@elements/Form";
import _STRINGS from "@/utils/LocalStrings";

const CitySearchInput = ({ onChange, options, value }: CitySearchInputProps) => (
  <div className="flex items-center w-full relative">
    <FormInput
      value={value}
      onChangeText={onChange}
      item={{
        containerClass: "relative w-full",
        inputClass: "rounded-full",
        iconUrl: "/assets/icons/edit/magnifier.svg",
        iconUrlClassName: "w-5 !top-[29%] h-5",
        placeholder: options?.placeholder || _STRINGS.SEARCH_DESTINY,
      }}
    />
    <button
      type="button"
      aria-label={_STRINGS.CLEAR_SEARCH}
      onClick={() => onChange("")}
      className={`cursor-pointer absolute left-4 z-5 ${
        value ? "opacity-75" : "opacity-0 pointer-events-none"
      } transition-all`}
    >
      <ContentImage
        alt=""
        width={12}
        height={12}
        className="w-3 h-3"
        src="/assets/icons/adds/x_mark.svg"
      />
    </button>
  </div>
);

export default CitySearchInput;
