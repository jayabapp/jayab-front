import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { ModalHeaderPartProps } from "@/types/components/elements/modal";

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
          <Icon name="chevron-start" size={16} />
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
        <Icon name="x" size={16} />
      </button>
      {children}
    </div>
  );
};

export default ModalHeaderPart;
