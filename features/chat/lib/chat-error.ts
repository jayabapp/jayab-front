const CHAT_ACCOUNT_MISMATCH_CODE = "CHAT13";

export const isChatAccountMismatch = (...errors: unknown[]) =>
  errors.some(
    (error) =>
      typeof error === "object" &&
      error !== null &&
      "message_code" in error &&
      error.message_code === CHAT_ACCOUNT_MISMATCH_CODE,
  );
