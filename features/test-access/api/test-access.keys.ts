export const testAccessKeys = {
  all: ["test-access"] as const,
  me: () => [...testAccessKeys.all, "me"] as const,
  members: () => [...testAccessKeys.all, "members"] as const,
};
