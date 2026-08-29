import type { ModalHeaderPartProps } from "@/types/components/elements/modal";

import ContentImage from "@elements/Image/ContentImage";
import _STRINGS from "@/utils/LocalStrings";

const ModalHeaderPart = ({
  onHide,
  title,
  hideArrow,
  children,
  titleClass,
  showX,
}: ModalHeaderPartProps) => {
  return (
    <div
      className={`app-text flex     border-b items-center ${showX ? "justify-between " : "justify-center"}   md:justify-between py-3 px-4 sticky top-0 bg-white  z-10`}
    >
      {!!hideArrow || showX ? (
        <></>
      ) : (
        <button
          aria-label={_STRINGS.BACK}
          className="absolute top-3 right-2 md:hidden"
          onClick={onHide}
          type="button"
        >
          <ContentImage alt="" className="h-4 w-4 -rotate-90" height={16} src="/assets/icons/shared/chevron.svg" width={16} />
        </button>
      )}
      <div className="flex flex-row gap-2">
        {" "}
        <p className={` text-base font-semibold ${titleClass || ""}`}>{title}</p>
      </div>{" "}
      <button
        aria-label={_STRINGS.CLOSE}
        className={showX ? "block" : "hidden md:block"}
        onClick={onHide}
        type="button"
      >
        <ContentImage alt="" className="h-3 w-3" height={12} src="/assets/icons/adds/x_mark.svg" width={12} />
      </button>
      {children}
    </div>
  );
};

export default ModalHeaderPart;
