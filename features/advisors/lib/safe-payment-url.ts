export const getSafePaymentUrl = (value: string | null | undefined) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (url.protocol === "http:" && url.hostname !== "localhost") return null;
    return url.toString();
  } catch {
    return null;
  }
};
