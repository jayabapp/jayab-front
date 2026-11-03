import type { SingleLandingDto } from "@/api_services/property/property.interface";

export const landingQueryDefaults = (
  landing?: Pick<SingleLandingDto, "query"> | null,
): Record<string, string> => {
  const query = landing?.query;
  if (!query) return {};
  return Object.entries(query).reduce<Record<string, string>>(
    (result, [key, value]) => {
      result[key] = Array.isArray(value) ? value.join(",") : `${value}`;
      return result;
    },
    {},
  );
};
