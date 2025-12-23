"use client";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
type KeyValue = Record<string, string>;

export function paramsToObject(entries: [string, string][]) {
  const result: KeyValue = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export const useQueryGet = <T>() => {
  const search = useSearchParams();
  const queries: KeyValue = useMemo(() => paramsToObject(Array.from(search?.entries())), [search?.entries()]);
  return queries as T;
};
export default useQueryGet;

export const useQueryGetPassParam = <T>(search: any) => {
  const queries: KeyValue = useMemo(() => paramsToObject(Array.from(search)), [search]);
  return queries as T;
};

export const getParameter = (paramName: string) => {
  var searchString = window.location.search.substring(1),
    i,
    val,
    params = searchString.split("&");
  for (i = 0; i < params.length; i++) {
    val = params[i].split("=");
    if (val[0] == paramName) {
      return val[1];
    }
  }
  return null;
};
