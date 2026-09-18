import numberWithCommas from "./numberWithCommas";
import _STRINGS from "@/utils/LocalStrings";

const formatToman = (value?: number | string | null) =>
  `${numberWithCommas(value ?? 0)} ${_STRINGS.TOMAN}`;

export default formatToman;
