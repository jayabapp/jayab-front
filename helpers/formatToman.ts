import numberWithCommas from "./numberWithCommas";

const formatToman = (value: number | string | null | undefined, unit: string) =>
  `${numberWithCommas(value ?? 0)} ${unit}`;

export default formatToman;
