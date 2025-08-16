"use client";

import { useEffect } from "react";

const SmoothScroll = () => {
  useEffect(() => {
    document.getElementsByTagName("html")[0].style.scrollBehavior = "smooth";

    return () => {
      document.getElementsByTagName("html")[0].style.scrollBehavior = "unset";
    };
  }, []);
  return null;
};

export default SmoothScroll;
