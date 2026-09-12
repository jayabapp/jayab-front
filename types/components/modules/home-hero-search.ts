import type { HeroSearchDraft } from "@/types/features/search";
import type { ReactNode } from "react";

export type HomeHeroSearchProps = {
  isPhone?: boolean;
  totalProperties?: number;
  variant?: "hero" | "header";
};

export type HeroSearchStep = "where" | "dates" | "guests";

export type HeroStepCardProps = {
  icon: string;
  title: string;
  summary: string;
  isActive: boolean;
  onOpen: () => void;
  children: ReactNode;
  hasBeenOpened: boolean;
};

export type HeroGuestsStepProps = {
  value?: number;
  onChange: (value: number) => void;
};

export type HeroMobileTriggerProps = {
  onOpen: () => void;
  onPreload: () => void;
  variant?: "hero" | "header";
  summary: { title: string; detail: string };
};

export type HeroSearchSheetProps = {
  count?: number;
  isPending: boolean;
  onClose: () => void;
  onReset: () => void;
  onSubmit: () => void;
  isCountStale?: boolean;
  draft: HeroSearchDraft;
  onPatch: (next: Partial<HeroSearchDraft>) => void;
};
