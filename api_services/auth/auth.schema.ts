import { object, string } from "yup";

export const sendOtpSchema = object({
  mobile_number: string()
    .required("auth.wrongNumber")
    .length(11, "auth.wrongNumber"),
});
