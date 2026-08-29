"use client";
import Image from "next/image";
import Modal from "@elements/Modal";

type TRemoteImageProps = {
  alt: string;
  src: string;
  show: boolean;
  onHide: () => void;
};

const RemoteImageModal = ({ show, src, alt, onHide }: TRemoteImageProps) => (
  <Modal show={show} onHide={onHide}>
    <div className="flex h-full w-full flex-col gap-2 bg-white p-2 ">
      <button
        type="button"
        onClick={onHide}
        className="self-start p-2"
        aria-label="بستن تصویر"
      >
        ×
      </button>
      <div className="relative min-h-[70vh] w-full flex-1">
        <Image
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
export default RemoteImageModal;
