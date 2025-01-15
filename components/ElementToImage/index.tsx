import React, { useCallback, useRef } from "react";
import { toJpeg } from "html-to-image";
import _STRINGS from "@/utils/LocalStrings";
import Button from "../shared/Button/Button";
import FixedBottomContainer from "../shared/FixedBottomContainer";

const ElementToImage = ({ children, ...props }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const onShare = async (shareData: any) => {
    const title = "افغان دیجیتال";

    const response = await fetch(shareData);
    const blob = await response.blob();
    const files = [
      new File([blob], "file.jpeg", {
        type: blob.type,
      }),
    ];

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
          onClick={onButtonClick}
        />
      </FixedBottomContainer>
    </>
  );
};

export default ElementToImage;
