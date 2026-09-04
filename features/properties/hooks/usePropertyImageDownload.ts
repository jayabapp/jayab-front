"use client";

import { PUBLIC_PROPERTY_IMAGE_DOWNLOAD } from "@/utils/urls";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const hasWebpSignature = async (blob: Blob) => {
  if (blob.size < 12) return false;
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  return (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
};

const validateImageDecode = async (objectUrl: string) => {
  const image = new window.Image();
  image.src = objectUrl;
  await image.decode();
};

export const usePropertyImageDownload = () => {
  const controllerRef = useRef<AbortController | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
    },
    [],
  );

  const downloadImage = useCallback(async (attachmentId?: number | null) => {
    if (!attachmentId || attachmentId <= 0) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsDownloading(true);

    try {
      const response = await fetch(
        PUBLIC_PROPERTY_IMAGE_DOWNLOAD(attachmentId),
        { signal: controller.signal },
      );
      const contentType = response.headers.get("content-type")?.toLowerCase();
      if (!response.ok || !contentType?.startsWith("image/webp"))
        throw new Error("INVALID_IMAGE_DOWNLOAD");

      const blob = await response.blob();
      if (
        !blob.size ||
        !blob.type.toLowerCase().startsWith("image/webp") ||
        !(await hasWebpSignature(blob))
      )
        throw new Error("INVALID_IMAGE_DOWNLOAD");

      const objectUrl = URL.createObjectURL(blob);
      try {
        await validateImageDecode(objectUrl);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = `jayab-property-image-${attachmentId}.webp`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } finally {
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("دانلود تصویر انجام نشد. لطفاً دوباره تلاش کنید.");
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setIsDownloading(false);
      }
    }
  }, []);

  return { downloadImage, isDownloading };
};
