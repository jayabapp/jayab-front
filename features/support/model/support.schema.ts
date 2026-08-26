import * as yup from "yup";

export const supportTicketSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required("عنوان تیکت الزامی است")
    .min(3, "عنوان تیکت باید حداقل ۳ کاراکتر باشد")
    .max(100, "عنوان تیکت نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),
  message: yup
    .string()
    .trim()
    .required("متن پیام الزامی است")
    .min(3, "متن پیام باید حداقل ۳ کاراکتر باشد")
    .max(5000, "متن پیام نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد"),
});

export const supportReplySchema = yup.object({
  message: yup
    .string()
    .trim()
    .required("متن پیام الزامی است")
    .min(3, "متن پیام باید حداقل ۳ کاراکتر باشد")
    .max(5000, "متن پیام نمی‌تواند بیشتر از ۵۰۰۰ کاراکتر باشد"),
});

export type SupportFormErrors = Partial<Record<"title" | "message", string[]>>;

export const getSupportFormErrors = (error: unknown): SupportFormErrors => {
  if (!(error instanceof yup.ValidationError)) return {};

  return error.inner.reduce<SupportFormErrors>((errors, issue) => {
    if (issue.path === "title" || issue.path === "message") {
      errors[issue.path] = [issue.message];
    }
    return errors;
  }, {});
};
