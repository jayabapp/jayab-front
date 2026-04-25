"use client";
import { useState } from "react";

export const useModalVisible = () => {
  const [isVisible, setIsVisible] = useState(false);

  const _onShow = () => setIsVisible(true);
  const _onHide = () => setIsVisible(false);
  return { isVisible, _onShow, _onHide, setIsVisible };
};
