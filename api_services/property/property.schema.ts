import { object, string } from "yup";

export const sendMediaSchema = object({
  feature_image_id: string().required("common.featureImageNeeded"),
});
