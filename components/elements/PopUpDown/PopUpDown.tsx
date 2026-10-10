import { useTranslations } from "next-intl";
import { Sheet } from "react-modal-sheet";

import type { PopUpDownProps } from "@/types/components/elements/popup-down";

import ContentImage from "@elements/Image/ContentImage";

const PopUpDown = ({
  item,
  visible,
  children,
  setVisible,
  containerClass,
}: PopUpDownProps) => {
  const t = useTranslations("common");

  return (
    <div className={item?.containerClass + "   "}>
      <Sheet
        isOpen={visible}
        onClose={() => setVisible(false)}
        detent={item?.popHieghtType || "content-height"}
        className={`${containerClass}  !fixed bg-transparent bottom-0 `}
      >
        <Sheet.Backdrop
          onTap={() => {
            setVisible(false);
          }}
        ></Sheet.Backdrop>
        <Sheet.Container className=" pop-container !fixed bg-transparent bottom-0 ">
          <Sheet.Header className="pb-0 px-4 pt-6 relative">
            <div className=" w-8 h-1 absolute left-0 mx-auto top-2 right-0 rounded-full bg-neutral-300 "></div>
            {item?.title ? (
              <>
                <div className="w-full text-center text-brand-600 font-bold">
                  {item?.title}
                </div>

                <button
                  type="button"
                  aria-label={t("close")}
                  onClick={() => setVisible(false)}
                  className="absolute top-6 h-4 w-4 cursor-pointer opacity-60"
                >
                  <ContentImage
                    alt=""
                    width={16}
                    height={16}
                    src="/assets/icons/adds/x_mark.svg"
                  />
                </button>
              </>
            ) : (
              <></>
            )}
          </Sheet.Header>
          <Sheet.Content className=" overflow-y-scroll bottom-0">
            <div className="h-full overflow-y-scroll">{children}</div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
};

export default PopUpDown;
