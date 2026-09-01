"use client";

import type { SimpleModalProps } from "@/types/components/elements/modal-variants";
import { ContentImage } from "@elements/Image";

import Image from "next/image";

const SimpleModal = ({
  title,
  subtitle,
  image,
  children,
  onClick,
}: SimpleModalProps) => {
  return (
    <div className="rounded-2xl bg-white  mx-2">
      <div className="flex items-start justify-between p-6">
        <div className="flex flex-col flex-items-start gap-2">
          {image && <Image alt="" src={image} width={34} height={34} />}
          {subtitle && (
            <span className="text-sm text-brand-600">{subtitle}</span>
          )}
        </div>
        {title && <span>{title}</span>}
        <button onClick={onClick}>
          <ContentImage
            alt=""
            width={24}
            height={24}
            src="/assets/icons/close.svg"
          />
        </button>
      </div>
      {children}
    </div>
  );
};

export default SimpleModal;
