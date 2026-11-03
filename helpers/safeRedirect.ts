export const safeInternalPath = (value?: string | null): string | null => {
  if (!value) return null;
  let candidate = value.trim();
  if (!candidate.startsWith("/")) return null;
  if (/^\/[/\\]/.test(candidate)) return null;
  try {
    const resolved = new URL(candidate, "https://placeholder.invalid");
    if (resolved.origin !== "https://placeholder.invalid") return null;
    candidate = `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return null;
  }
  return candidate;
};

export default safeInternalPath;
