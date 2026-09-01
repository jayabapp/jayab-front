import type { ElementToImageProps } from "@/types/components/modules/owner-property-inquiry";
import { useRef } from "react";

import FixedBottomContainer from "@elements/FixedBottomContainer";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";

const ElementToImage = ({ children, ...props }: ElementToImageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const onShare = async (files: File[]) => {
    const shareDetails = { files };
    if (navigator.share) {
      try {
        await navigator.share(shareDetails);
      } catch {}
    }
  };

  const onButtonClickCanvas = async () => {
    if (ref.current === null) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(ref.current);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const files = [new File([blob], "image.jpg", { type: blob.type })];
      void onShare(files);
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
