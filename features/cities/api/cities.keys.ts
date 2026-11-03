export const cityKeys = {
  all: ["city"] as const,
  tree: () => [...cityKeys.all, "tree", { depth: "full", isParent: true }] as const,
};
