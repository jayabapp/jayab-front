import _STRINGS from "@/utils/LocalStrings";
import { object, string } from "yup";

export const sendOtpSchema = object({
  mobile_number: string().required(_STRINGS.WRONG_NUMBER).length(11, _STRINGS.WRONG_NUMBER),
});
