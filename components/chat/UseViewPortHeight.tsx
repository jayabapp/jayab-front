import { useEffect } from "react";
import { isIOS } from "react-device-detect";

const useViewportHeightFix = (
  setHeight: React.Dispatch<any>,
  setOffSetTop: React.Dispatch<React.SetStateAction<number>>
) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const resizeHandler = () => {};

        window.visualViewport.addEventListener("resize", resizeHandler);

        setHeight(window.visualViewport?.height);
        setOffSetTop(window.visualViewport?.offsetTop);
      }
    };

    if (window.visualViewport && isIOS) {
      window.visualViewport.addEventListener("scroll", handleResize);
    } else {
      window.addEventListener("resize", handleResize);
    }
    handleResize(); // Initial call to set the value

    return () => window.removeEventListener("resize", handleResize);
  }, []);
};
export default useViewportHeightFix;
