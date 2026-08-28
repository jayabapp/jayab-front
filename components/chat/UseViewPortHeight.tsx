import { useEffect } from "react";
import { isIOS } from "react-device-detect";

const useViewportHeightFix = (
  setHeight: React.Dispatch<any>,
  setOffSetTop: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    const viewport = window.visualViewport;
    const updateViewport = () => {
      if (!viewport) return;
      setHeight(viewport.height);
      setOffSetTop(viewport.offsetTop);
    };

    if (viewport && isIOS) {
      viewport.addEventListener("resize", updateViewport);
      viewport.addEventListener("scroll", updateViewport);
    } else {
      window.addEventListener("resize", updateViewport);
    }
    updateViewport();

    return () => {
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, [setHeight, setOffSetTop]);
};
export default useViewportHeightFix;
