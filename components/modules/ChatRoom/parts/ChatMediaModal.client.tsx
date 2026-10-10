"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";

import type { ChatMediaProps } from "@/types/components/modules/chat";

import Modal from "@elements/Modal";

const ChatMediaModal = ({ show, src, onClose }: ChatMediaProps) => {
  const t = useTranslations();

  return (
    <Modal show={show} onHide={onClose}>
      <div className="flex h-full w-full flex-col bg-black/90 p-3">
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="mb-3 self-end text-2xl text-white"
        >
          ×
        </button>
        <div className="relative min-h-0 flex-1">
          <ContentImage
            fill
            src={src}
            sizes="100vw"
            className="object-contain"
            alt={t("chat.messageImage")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ChatMediaModal;
