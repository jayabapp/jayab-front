"use client";

import type { SimpleModalProps } from "@/types/components/elements/modal-variants";
import { Icon } from "@elements/Icon";

import Image from "next/image";

const SimpleModal = ({
  title,
  subtitle,
  image,
  children,
  onClick,
}: SimpleModalProps) => {
  return (
    <div className="rounded-2xl bg-surface  mx-2">
      <div className="flex items-start justify-between p-6">
        <div className="flex flex-col flex-items-start gap-2">
          {image && <Image alt="" src={image} width={34} height={34} />}
          {subtitle && <span className="text-sm text-link">{subtitle}</span>}
        </div>
        {title && <span>{title}</span>}
        <button onClick={onClick}>
          <Icon name="x" size={24} />
        </button>
      </div>
      {children}
    </div>
  );
};

export default SimpleModal;
