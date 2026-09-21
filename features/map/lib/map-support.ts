let supportCache: boolean | undefined;

export const canRenderNeshanMap = () => {
  if (typeof window === "undefined") return false;
  if (supportCache !== undefined) return supportCache;
  try {
    supportCache =
      "DecompressionStream" in window &&
      !!document.createElement("canvas").getContext("webgl2");
  } catch {
    supportCache = false;
  }
  return supportCache;
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
