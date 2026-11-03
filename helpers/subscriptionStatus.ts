export const subscriptionStatus = (
  expiresAt?: Date | string | number | null,
) => {
  const expiry = expiresAt ? new Date(expiresAt).getTime() : NaN;
  if (Number.isNaN(expiry)) return { isActive: false, remainingDays: 0 };
  const now = Date.now();
  return {
    isActive: now < expiry,
    remainingDays: Math.trunc((expiry - now) / 86_400_000),
  };
};

export default subscriptionStatus;
