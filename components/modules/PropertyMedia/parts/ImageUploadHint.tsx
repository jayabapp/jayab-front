import { imageUploadMaxDimension } from "@features/upload/lib/image-upload";
import { useTranslations } from "next-intl";

const ImageUploadHint = ({ link }: { link: string }) => {
  const t = useTranslations("common");
  return (
    <p className="max-w-xs text-xs leading-6 text-ink-subtle">
      {t("imageUploadHint", { maxDimension: imageUploadMaxDimension(link) })}
    </p>
  );
};

export default ImageUploadHint;
