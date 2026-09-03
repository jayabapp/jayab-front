export type HeroSegmentProps = {
  label: string;
  value: string;
  /** Drives the value's weight and colour — an answered cell reads as answered. */
  filled?: boolean;
  widthClass?: string;
  onClick: () => void;
};

export type HeroGuestsFieldProps = {
  value?: number;
  onChange: (value: number) => void;
};

export type HeroDatesRange = {
  checkin?: string;
  checkout?: string;
};

export type HeroDatesFieldProps = HeroDatesRange & {
  onChange: (next: HeroDatesRange) => void;
};

export type HomeHeroSearchProps = {
  /** Rendered under the bar when known; omitted rather than guessed. */
  totalProperties?: number;
};
