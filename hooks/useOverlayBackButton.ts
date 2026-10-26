"use client";

import { useCallback, useEffect, useRef } from "react";

export const useOverlayBackButton = (
  isOpen: boolean,
  onClose: () => void | false,
) => {
  const onCloseRef = useRef(onClose);
  const hasPushedRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    window.history.pushState({ overlay: true }, "");
    hasPushedRef.current = true;
    const onPopState = () => {
      hasPushedRef.current = false;
      if (onCloseRef.current() !== false) return;
      window.history.pushState({ overlay: true }, "");
      hasPushedRef.current = true;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isOpen]);

  return useCallback(() => {
    onClose();
    if (!hasPushedRef.current) return;
    hasPushedRef.current = false;
    window.history.back();
  }, [onClose]);
};
