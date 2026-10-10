"use client";
import { ContentImage } from "@elements/Image";
import Modal from "@elements/Modal";
import { useTranslations } from "next-intl";

type TRemoteImageProps = {
  alt: string;
  src: string;
  show: boolean;
  onHide: () => void;
};

const RemoteImageModal = ({ show, src, alt, onHide }: TRemoteImageProps) => {
  const t = useTranslations("common");

  return (
    <Modal show={show} onHide={onHide}>
      <div className="flex h-full w-full flex-col gap-2 bg-white p-2 ">
        <button
          type="button"
          onClick={onHide}
          className="self-start p-2"
          aria-label={t("closeImage")}
        >
          ×
        </button>
        <div className="relative min-h-[70vh] w-full flex-1">
          <ContentImage
            fill
            src={src}
            alt={alt}
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>
    </Modal>
  );
};
export default RemoteImageModal;
