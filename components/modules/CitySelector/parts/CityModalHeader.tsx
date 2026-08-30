import type { CityModalHeaderProps } from "@/types/components/modules/city-selector";

import { ContentImage } from "@elements/Image";
import _STRINGS from "@/utils/LocalStrings";

const CityModalHeader = ({ onBack, onHide, selectedProvince }: CityModalHeaderProps) => (
  <div className="app-text flex justify-between border-b items-center py-5 custome-shadow-card px-4 sticky top-0 bg-white z-10">
    <button
      type="button"
      onClick={onBack}
      disabled={!selectedProvince}
      aria-label={_STRINGS.BACK}
      className={`-rotate-90 transition-all ${selectedProvince ? "" : "opacity-0"}`}
    >
      <ContentImage alt="" width={16} height={16} src="/assets/icons/shared/chevron.svg" />
    </button>
    <p className="text-base font-semibold">
      {selectedProvince ? _STRINGS.SELECT_CITY : _STRINGS.SELECT_PROVE_CITY}
    </p>
    <button type="button" onClick={onHide} aria-label={_STRINGS.CLOSE}>
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

export default CityModalHeader;
