export type TLineardataProps = {
  title: string;
  value: string;
  disableDash?: boolean;
  textClassName?: string;
  titleClassName?: string;
  containerClassName?: string;
};

export type TProgressBarProps = {
  color?: string;
  progress: number;
  trackColor?: string;
};

export type TStatusProps = {
  data: any;
  containerClass?: string;
};

export type TStepShowerProps = {
  value: string | number;
  steps: {
    title: string;
    description?: string;
    id: number | string;
    link?: string;
  }[];
};

export type TSearchBoxProps = {
  onSubmitCB: () => void | null;
  options?: { cotainerClass?: string };
};
