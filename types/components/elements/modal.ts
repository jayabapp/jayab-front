import type { Dispatch, ReactNode, SetStateAction } from "react";

export type ModalOptions = { containerClass?: string; parentClass?: string; zIndex?: number };
export type ModalProps = {
  children?: ReactNode;
  onHide: () => void;
  onScroll?: Dispatch<SetStateAction<number>>;
  show?: boolean;
  options?: ModalOptions;
  zIndex?: number;
};
export type AnimationlessModalProps = Omit<ModalProps, "onHide" | "onScroll" | "zIndex"> & { onHide?: () => void };
export type ModalBottomSheetProps = Pick<ModalProps, "children" | "onHide" | "show" | "options">;
export type ModalHeaderPartProps = {
  onHide: () => void | null;
  title: string;
  hideArrow?: boolean;
  showX?: boolean;
  children?: ReactNode;
  titleClass?: string;
};
