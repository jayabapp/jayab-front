import React, { useState, useEffect, ReactNode } from "react";
import { Sheet } from "react-modal-sheet";

type popUpsType = {
  item?: {
    containerClass?: string;
    headerIcon?: string;
    title?: string;
    popHieghtType?: "content-height" | "full-height";
  };
  visible: boolean;
  children?: ReactNode;
  setVisible: (e: boolean) => void;

  containerClass?: string;
};

const PopUpDown = ({ item, visible, setVisible, children, containerClass }: popUpsType) => {
  return (
    <div className={item?.containerClass + "   "}>
      <Sheet
        isOpen={visible}
        onClose={() => setVisible(false)}
        className={`${containerClass}  !fixed bg-transparent bottom-0 `}
        detent={item?.popHieghtType || "content-height"}
      >
        <Sheet.Backdrop
          onTap={() => {
            setVisible(false);
          }}
        ></Sheet.Backdrop>
        <Sheet.Container className=" pop-container !fixed bg-transparent bottom-0 ">
          <Sheet.Header className="pb-0 px-4 pt-6 relative">
            <div className=" w-8 h-1 absolute left-0 mx-auto top-2 right-0 rounded-full bg-gray-300 "></div>
            {item?.title ? (
              <>
                <div className="w-full text-center text-primary-700 font-bold"> {item?.title}</div>

                <img
                  src="/assets/icons/adds/x_mark.svg"
                  onClick={() => {
                    setVisible(false);
                  }}
                  className=" w-4 h-4 absolute   cursor-pointer   opacity-60
             top-6 "
                />
              </>
            ) : (
              <></>
            )}
          </Sheet.Header>
          <Sheet.Content className=" overflow-y-scroll bottom-0">
            {" "}
            <div className="h-full overflow-y-scroll">{children}</div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
};

export default PopUpDown;
