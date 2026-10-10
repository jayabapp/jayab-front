import { translateMessage } from "@lib/i18n/browser-translator";

import { Schema } from "yup";

export const YupValidator = async <T>(data: T, schema: Schema) => {
  try {
    await schema.validate(data);
  } catch (error) {
    const { ValidationError } = await import("yup");

    if (error instanceof ValidationError) {
      const { default: Notify } = await import("@elements/Toast");

      const message = translateMessage(error?.message);

      Notify({
        type: "warn",

        body: message,

        title: translateMessage("common.attention"),
      });

      throw message;
    } else {
      throw error;
    }
  }
};
