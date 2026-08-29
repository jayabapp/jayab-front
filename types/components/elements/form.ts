import type { ReactNode, RefObject } from "react";

export type FormFieldItem = {
  containerClass?: string;
  title?: string;
  iconUrl?: string;
  iconUrlClassName?: string;
  iconEndUrl?: string;
  iconEndUrlClassName?: string;
  iconFunc?: () => void | null;
  iconEndFunc?: () => void | null;
  titleClass?: string;
  hint?: string;
  direction?: string;
  placeholder?: string;
  titleHint?: string;
  inputClass?: string;
  keyboard?: string;
  id?: number;
  maxLength?: number;
  isMandatory?: boolean;
  disableHover?: boolean;
  maxLengthShower?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  disable?: boolean;
  extraElement?: ReactNode;
  convertToText?: boolean;
  onClick?: () => void | null;
  passedRef?: RefObject<HTMLInputElement | null>;
  rows?: number;
};

export type FormInputProps = {
  value: string | number | undefined;
  errorKey?: string;
  onChangeText: (value: any) => void | null;
  errors?: Record<string, string[]>;
  item?: FormFieldItem;
};

export type ExternalUnitInputProps = FormInputProps & { unit?: string };
export type MultiLineFormInputProps = FormInputProps;

export type CheckboxProps = {
  title?: ReactNode;
  isChecked: boolean;
  onSelect: () => void;
  containerClass?: string;
  rounded?: string;
  titleClass?: string;
  disabled?: boolean;
};

export type CheckboxCardContainerProps = {
  isChecked: boolean;
  title?: string;
  description?: string;
  children?: ReactNode;
  onSelect: () => void;
  item?: { disabled?: boolean; hint?: string };
};

export type CounterProps = {
  value: any;
  setValue: (value: number) => void | null;
  placeholder?: string;
  plusMinusNumber?: number;
  max?: number;
  containerClass?: string;
  items?: { inpuClass?: string; disableInput?: boolean };
};

export type SelectItem = {
  id: number | string;
  title: string;
  hex?: string;
  [key: string]: any;
};

export type MultiSelectProps = {
  item?: { disableHover?: boolean; placeholder?: string; list: SelectItem[]; disable?: boolean; full_item?: boolean };
  value: any[];
  closeOnSelect?: boolean;
  onSelect: (value: any) => void | null;
  title?: string;
};

export type MultiSelectItemProps = {
  item: SelectItem;
  value: any[];
  onSelect: (value: any) => void | null;
  closeOnSelect?: boolean;
  setShow?: (show: boolean) => void | null;
  full_item?: boolean;
};

export type SingleSelectProps = {
  item?: FormFieldItem & { list: SelectItem[]; searcheable?: boolean };
  value: string | number;
  closeOnSelect?: boolean;
  velueString?: string;
  onSelect: (value: string | number) => void | null;
};

export type SingleSelectItemProps = {
  item: SelectItem;
  value?: string | number;
  onSelect: (value: string | number) => void | null;
  closeOnSelect?: boolean;
  velueString?: string;
  setShow?: (show: boolean) => void | null;
};
