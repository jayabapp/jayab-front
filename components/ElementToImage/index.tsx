import { useCallback, useRef } from "react";

import FixedBottomContainer from "../shared/FixedBottomContainer";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";

const ElementToImage = ({ children, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const onShare = async (files: any) => {
    const shareDetails = { files };
    if (navigator.share) {
      try {
        await navigator
          .share(shareDetails)
          .then(() => console.log("Your content was shared"));
      } catch (error) {}
    }
  };

  const onButtonClickCanvas = async () => {
    if (ref.current === null) {
      alert("wtf");
      return;
    }
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(ref.current);
    canvas.toBlob(async (blob: any) => {
      const files = await [new File([blob], "image.jpg", { type: blob.type })];
      onShare(files);
    });
  };
  return (
    <>
      <div ref={ref} {...props}>
        {children}
      </div>
      <FixedBottomContainer>
        <Button
          title={_STRINGS.SHARE}
          width=" w-[90%] md:w-1/2"
          roundedClass="rounded-full"
          onClick={onButtonClickCanvas}
          containerClass="w-full flex items-center justify-center"
        />
      </FixedBottomContainer>
    </>
  );
};

export default ElementToImage;
