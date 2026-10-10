import { useTranslations } from "next-intl";

import type { ModalHeaderPartProps } from "@/types/components/elements/modal";

import ContentImage from "@elements/Image/ContentImage";

const ModalHeaderPart = ({
  title,
  showX,
  onHide,
  children,
  hideArrow,
  titleClass,
}: ModalHeaderPartProps) => {
  const t = useTranslations("common");

  return (
    <div
      className={`app-text flex border-b items-center ${showX ? "justify-between " : "justify-center"} md:justify-between py-3 px-4 sticky top-0 bg-surface z-10`}
    >
      {!!hideArrow || showX ? (
        <></>
      ) : (
        <button
          type="button"
          onClick={onHide}
          aria-label={t("back")}
          className="absolute top-3 start-2 md:hidden"
        >
          <ContentImage
            alt=""
            width={16}
            height={16}
            className="h-4 w-4 -rotate-90"
            src="/assets/icons/shared/chevron.svg"
          />
        </button>
      )}
      <div className="flex flex-row gap-2">
        <p className={` text-base font-semibold ${titleClass || ""}`}>
          {title}
        </p>
      </div>
      <button
        type="button"
        onClick={onHide}
        aria-label={t("close")}
        className={showX ? "block" : "hidden md:block"}
      >
        <ContentImage
          alt=""
          width={12}
          height={12}
          className="h-3 w-3"
          src="/assets/icons/adds/x_mark.svg"
        />
      </button>
      {children}
    </div>
  );
};

export default ModalHeaderPart;
