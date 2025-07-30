import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url";
import React from "react";
import { isAndroid } from "react-device-detect";

const mapRedirectHelper = ({ title, longitude, latitude }: { title?: string; latitude: number; longitude: number }) => {
  const createMapLink = () => {
    const label = title || "ملک";
    const uriBegin = `geo:${latitude},${longitude}`;
    const query = `${latitude},${longitude}(` + label + ")";
    const encodedQuery = encodeURI(query);
    const uriString = uriBegin + "?q=" + encodedQuery;
    return parseUrl(uriString);
  };
  return !isAndroid
    ? `http://maps.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
    : createMapLink();
};

export default mapRedirectHelper;
