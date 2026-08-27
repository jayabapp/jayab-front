"use client";

import Modal from "@/components/Modal";
import Image from "next/image";

type TChatMediaProps = {
  src: string;
  show: boolean;
  onClose: () => void;
};

const ChatMediaModal = ({ show, src, onClose }: TChatMediaProps) => (
  <Modal show={show} onHide={onClose}>
    <div className="flex h-full w-full flex-col bg-black/90 p-3">
      <button
        type="button"
        aria-label="بستن"
        onClick={onClose}
        className="mb-3 self-end text-2xl text-white"
      >
        ×
      </button>
      <div className="relative min-h-0 flex-1">
        <Image
          fill
          src={src}
          sizes="100vw"
          alt="تصویر پیام"
          className="object-contain"
        />
      </div>
    </div>
  </Modal>
);

export default ChatMediaModal;
