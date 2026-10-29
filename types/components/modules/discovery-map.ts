import type { PropertyCardSearchParams } from "@/types/components/modules/property-grid";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { ReactNode } from "react";

// "column": beside the list on wide screens. "background": behind the results sheet on
// phones and tablets.
export type DiscoveryMapVariant = "column" | "background";

export type SheetSnap = "peek" | "half" | "full";

type DiscoveryQuery = Record<string, any>;

export type DiscoveryMapHostProps = {
  query: DiscoveryQuery;
};

export type DiscoveryMobileMapProps = {
  header: ReactNode;
  children: ReactNode;
  query: DiscoveryQuery;
};

// One finger or mouse drag on the results sheet, from press to release.
export type SheetGesture = {
  y: number;
  x: number;
  start: number;
  lastY: number;
  lastT: number;
  velocity: number;
  axis: "x" | "y" | null;
  dragging: boolean;
  fromHandle: boolean;
};

export type ResultsSheetProps = {
  snap: SheetSnap;
  header: ReactNode;
  children: ReactNode;
  onSnapChange: (snap: SheetSnap) => void;
  onVisibleHeightChange?: (height: number) => void;
};

export type DiscoveryMapProps = {
  query: DiscoveryQuery;
  onClose: () => void;
  isListSettled: boolean;
  // How much of the map's foot is covered (by the results sheet), so cards and fitted
  // areas stay in the part that shows.
  bottomInset?: number;
  variant: DiscoveryMapVariant;
  properties: PropertyListDto[];
};

export type DiscoveryMapPreviewProps = {
  id: number;
  onClose: () => void;
  properties: PropertyListDto[];
  searchParams: PropertyCardSearchParams;
};

export type MapToggleButtonProps = {
  className?: string;
};

export type DiscoveryMapProblemProps = {
  title: string;
  hint?: string;
  onBack?: () => void;
  onRetry?: () => void;
};
