import { isAndroid } from "react-device-detect";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";

type MapLinkParams = { title?: string; latitude: number; longitude: number };

export const googleDirectionsHref = ({ latitude, longitude }: MapLinkParams) =>
  `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

const mapRedirectHelper = (params: MapLinkParams) => {
  if (!isAndroid) return googleDirectionsHref(params);
  const { title, latitude, longitude } = params;
  const query = encodeURI(`${latitude},${longitude}(${title || "ملک"})`);
  return parseUrl(`geo:${latitude},${longitude}?q=${query}`).href;
};

export default mapRedirectHelper;
