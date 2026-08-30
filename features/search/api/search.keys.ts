export const searchKeys = {
  all: ["search"] as const,
  suggestions: (normalizedTerm: string) =>
    [...searchKeys.all, "suggestions", { term: normalizedTerm, version: "v2" }] as const,
  extract: () => [...searchKeys.all, "extract", { version: "v1" }] as const,
};
