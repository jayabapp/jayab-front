import React, { useState, useEffect, ReactNode } from "react";
import { Sheet } from "react-modal-sheet";

type popUpsType = {
  item?: { containerClass?: string; headerIcon?: string; title?: string };
  visible: boolean;
  children?: ReactNode;
  setVisible: (e: boolean) => void;

  containerClass?: string;
};

const PopUpDown = ({ item, visible, setVisible, children, containerClass }: popUpsType) => {
  return (
    <div className={item?.containerClass + " mb-4"}>
      <Sheet isOpen={visible} onClose={() => setVisible(false)} className={`${containerClass}`} detent="content-height">
        <Sheet.Container>
          <Sheet.Header> {item?.title ? <></> : <></>}</Sheet.Header>
          <Sheet.Content>{children}</Sheet.Content>
        </Sheet.Container>
      </Sheet>
    </div>
  );
};

export default PopUpDown;
