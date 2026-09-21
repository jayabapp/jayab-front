"use client";

import { usePropertyImageDownload } from "@features/properties/hooks/usePropertyImageDownload";

import type { PropertyImageDownloadButtonProps } from "@/types/components/modules/property-gallery";

import _STRINGS from "@/utils/LocalStrings";

const PropertyImageDownloadButton = ({
  attachmentId,
}: PropertyImageDownloadButtonProps) => {
  const { downloadImage, isDownloading } = usePropertyImageDownload();

  return (
    <button
      type="button"
      disabled={isDownloading}
      aria-label={_STRINGS.DOWNLOAD_IMAGE}
      onClick={() => void downloadImage(attachmentId)}
      className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:cursor-wait disabled:opacity-60"
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
      <span className="hidden sm:inline">
        {isDownloading ? _STRINGS.DOWNLOADING : _STRINGS.DOWNLOAD}
      </span>
    </button>
  );
};

export default PropertyImageDownloadButton;
