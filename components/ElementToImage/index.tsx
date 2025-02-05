import React, { useCallback, useRef } from "react";
import { toJpeg } from "html-to-image";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";
import FixedBottomContainer from "../shared/FixedBottomContainer";
import html2canvas from "html2canvas";
const ElementToImage = ({ children, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const onShare = async (files: any) => {
    const title = "jayab";

    // const response = await fetch(shareData);
    // const blob = await response.blob();
    // const files = [
    //   new File([blob], "file.jpeg", {
    //     type: blob.type,
    //   }),
    // ];

    const shareDetails = { title, files };
    if (navigator.share) {
      try {
        await navigator.share(shareDetails).then(() => console.log("Your content was shared"));
      } catch (error) {}
    }
  };
  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    const newEl = ref.current;
    if (!!newEl) {
      console.log(newEl, "newElnewEl");
      toJpeg(newEl, { cacheBust: true, includeQueryParams: true })
        .then((dataUrl) => {
          // const link = document.createElement("a");
          // link.download = "my-image-name.png";
          // link.href = dataUrl;
          // link.click();

          onShare(dataUrl);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      return null;
    }
  }, [ref]);

  ///////
  const onButtonClickCanvas = async () => {
    if (ref.current === null) {
      alert("wtf");
      return;
    }

    const canvas = await html2canvas(ref.current);
    canvas.toBlob(async (blob: any) => {
      const files = [new File([blob], "image.jpg", { type: blob.type })];
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
          containerClass="w-full flex items-center justify-center"
          roundedClass="rounded-full"
          width=" w-[90%] md:w-1/2"
          title={_STRINGS.SHARE}
          onClick={onButtonClickCanvas}
        />
      </FixedBottomContainer>
    </>
  );
};

export default ElementToImage;
