import Notify from "@/components/shared/Toast";
import { Schema, ValidationError } from "yup";
import _STRINGS from "./LocalStrings";
export const YupValidator = async <T>(data: T, schema: Schema) => {
  try {
    await schema.validate(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      Notify({ type: "warn", body: error?.message, title: _STRINGS.ATTENTION });
      throw error.message;
    } else {
      throw error;
    }
  }
};
