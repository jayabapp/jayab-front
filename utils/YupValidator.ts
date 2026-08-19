import { Schema } from "yup";

import _STRINGS from "./LocalStrings";

export const YupValidator = async <T>(data: T, schema: Schema) => {
  try {
    await schema.validate(data);
  } catch (error) {
    const { ValidationError } = await import("yup");
    if (error instanceof ValidationError) {
      const { default: Notify } = await import("@/components/shared/Toast");
      Notify({ type: "warn", body: error?.message, title: _STRINGS.ATTENTION });
      throw error.message;
    } else {
      throw error;
    }
  }
};
