import type { Translate } from "@/types/i18n";
import * as yup from "yup";

export const supportTicketSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("validation.ticketTitleRequired")
    .min(3, "validation.ticketTitleMin")
    .max(100, "validation.ticketTitleMax"),
  message: yup
    .string()
    .trim()
    .required("validation.messageRequired")
    .min(3, "validation.messageMin")
    .max(5000, "validation.messageMax"),
});

export const supportReplySchema = yup.object({
  message: yup
    .string()
    .trim()
    .required("validation.messageRequired")
    .min(3, "validation.messageMin")
    .max(5000, "validation.messageMax"),
});

export type SupportFormErrors = Partial<Record<"title" | "message", string[]>>;

// Schema messages are message keys; the caller translates them.
export const getSupportFormErrors = (
  error: unknown,
  translate: Translate,
): SupportFormErrors => {
  if (!(error instanceof yup.ValidationError)) return {};

  return error.inner.reduce<SupportFormErrors>((errors, issue) => {
    if (issue.path === "title" || issue.path === "message") {
      errors[issue.path] = [translate(issue.message)];
    }
    return errors;
  }, {});
};
