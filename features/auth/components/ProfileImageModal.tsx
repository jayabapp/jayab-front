"use client";

import Modal from "@elements/Modal";
import { ContentImage } from "@elements/Image";

type TProfileImageProps = {
  src: string;
  onClose: () => void;
  onDelete?: () => void;
};

const ProfileImageModal = ({ src, onClose, onDelete }: TProfileImageProps) => (
  <Modal show onHide={onClose}>
    <div className="flex h-full w-full flex-col gap-3 bg-white p-3 ">
      <div className="flex justify-between">
        <button type="button" onClick={onClose} aria-label="بستن">
          ×
        </button>
        {onDelete ? (
          <button type="button" onClick={onDelete} className="text-red-600">
            حذف
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="relative min-h-0 flex-1">
        <ContentImage
          fill
          src={src}
          sizes="100vw"
          alt="تصویر پروفایل"
          className="object-contain"
        />
      </div>
    </div>
  </Modal>
);

export default ProfileImageModal;
