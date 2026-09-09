import type { HeroSearchDraft } from "@/types/features/search";
import type { ReactNode } from "react";

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
  /**
   * Server-detected phone. Picks between the three-cell bar and the stepped
   * sheet at render time rather than at breakpoint, so only one of the two ever
   * mounts — the house pattern for mobile chrome, and the reason the calendar
   * and the popover do not ship a second copy of themselves to phones.
   */
  isPhone?: boolean;
  variant?: "hero" | "header";
};

export type HeroSearchStep = "where" | "dates" | "guests";

export type HeroStepCardProps = {
  children: ReactNode;
  /** Icon for the step's leading badge. */
  icon: string;
  isActive: boolean;
  /** False until the step is first opened, so its body stays unmounted. */
  hasBeenOpened: boolean;
  onOpen: () => void;
  /** The answered value, shown while the step is collapsed. */
  summary: string;
  title: string;
};

export type HeroGuestsStepProps = {
  value?: number;
  onChange: (value: number) => void;
};

export type HeroMobileTriggerProps = {
  onOpen: () => void;
  /** Starts fetching the sheet's chunk on touch-down, before the tap resolves. */
  onPreload: () => void;
  summary: { title: string; detail: string };
  variant?: "hero" | "header";
};

export type HeroSearchSheetProps = {
  /** How many properties the staged draft matches; undefined until asked. */
  count?: number;
  draft: HeroSearchDraft;
  /** True while the count on screen belongs to an older draft. */
  isCountStale?: boolean;
  isPending: boolean;
  onClose: () => void;
  onPatch: (next: Partial<HeroSearchDraft>) => void;
  onReset: () => void;
  onSubmit: () => void;
};
