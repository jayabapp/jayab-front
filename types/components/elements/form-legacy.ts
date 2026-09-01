import type { CSSProperties, Dispatch, ReactNode, SetStateAction } from "react";

export type SearchFormProps = {
  errorKey?: string;
  errors?: Record<string, string[]>;
  item?: {
    autoFocus?: boolean;
    containerClass?: string;
    convertToText?: boolean;
    direction?: string;
    disableHover?: boolean;
    disabled?: boolean;
    extraElement?: ReactNode;
    hint?: string;
    iconEndFunc?: () => void | null;
    iconEndUrl?: string;
    iconEndUrlClassName?: string;
    iconFunc?: () => void | null;
    iconUrl?: string;
    iconUrlClassName?: string;
    id?: number;
    inputClass?: string;
    isMandatory?: boolean;
    keyboard?: string;
    maxLength?: number;
    maxLengthShower?: boolean;
    onClick?: () => void | null;
    placeholder?: string;
    title?: string;
    titleClass?: string;
    titleHint?: string;
  };
  onChangeText: (value: unknown) => void | null;
  value: string | number | undefined;
};

export type RangeSliderMark = {
  label: string;
  style: CSSProperties;
};

export type MultiRangeSliderProps = {
  max: number;
  min: number;
  setValue: (value: number) => void | null;
  value: number;
};

export type IosToggleProps = {
  disableTransform?: boolean;
  disabled?: boolean;
  index: number;
  onClick: () => void | null;
  toggle: boolean;
};

export type SingleRangeSliderProps = {
  marks: Record<number, RangeSliderMark>;
  max: number;
  min: number;
  setValue: Dispatch<SetStateAction<number>>;
  value: number;
};
