import { ReactNode } from "react";

const ModalHeaderPart = ({
  onHide,
  title,
  hideArrow,
  children,
  titleClass,
  showX,
}: {
  onHide: () => void | null;
  title: string;
  hideArrow?: boolean;
  showX?: boolean;
  children?: ReactNode;
  titleClass?: string;
}) => {
  return (
    <div
      className={`app-text flex     border-b items-center ${showX ? "justify-between " : "justify-center"}   md:justify-between py-3 px-4 sticky top-0 bg-white  z-10`}
    >
      {!!hideArrow || showX ? (
        <></>
      ) : (
        <img
          src="/assets/icons/shared/chevron.svg"
          className="w-4 cursor-pointer absolute top-4 right-2  -rotate-90 md:hidden block h-4 "
          alt=""
          onClick={onHide}
        />
      )}
      <div className="flex flex-row gap-2">
        {" "}
        <p className={` text-base font-semibold ${titleClass || ""}`}>{title}</p>
      </div>{" "}
      <img
        src="/assets/icons/adds/x_mark.svg"
        className={`w-3   ${showX ? "block" : "hidden md:block"} cursor-pointer  h-3 `}
        alt=""
        onClick={onHide}
      />
      {children}
    </div>
  );
};

export default ModalHeaderPart;
