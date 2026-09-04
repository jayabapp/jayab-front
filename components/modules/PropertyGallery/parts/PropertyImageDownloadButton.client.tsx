"use client";

import type { PropertyImageDownloadButtonProps } from "@/types/components/modules/property-gallery";
import { usePropertyImageDownload } from "@features/properties/hooks/usePropertyImageDownload";

const PropertyImageDownloadButton = ({
  attachmentId,
}: PropertyImageDownloadButtonProps) => {
  const { downloadImage, isDownloading } = usePropertyImageDownload();

  return (
    <button
      type="button"
      disabled={isDownloading}
      aria-label="دانلود تصویر"
      onClick={() => void downloadImage(attachmentId)}
      className="absolute left-3 top-3 z-10 flex h-10 items-center gap-1.5 rounded-full bg-black/60 px-3 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-black/75 disabled:cursor-wait disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
      {isDownloading ? "در حال دانلود" : "دانلود"}
    </button>
  );
};

export default PropertyImageDownloadButton;
