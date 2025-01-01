import _STRINGS from "@/utils/LocalStrings";
import { object, string } from "yup";

export const sendMediaSchema = object({
  feature_image_id: string().required(_STRINGS.FEATURE_IMAGE_NEEDED),
});
