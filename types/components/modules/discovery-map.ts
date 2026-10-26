import type { PropertyCardSearchParams } from "@/types/components/modules/property-grid";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { ReactNode } from "react";

export type DiscoveryMapVariant = "column" | "sheet";

type DiscoveryQuery = Record<string, any>;

export type DiscoveryMapHostProps = {
  query: DiscoveryQuery;
  isFilterOpen: boolean;
  onOpenFilters: () => void;
  onCloseFilters: () => void;
};

export type DiscoveryMapProps = {
  query: DiscoveryQuery;
  onClose: () => void;
  isListSettled: boolean;
  onOpenFilters?: () => void;
  variant: DiscoveryMapVariant;
  properties: PropertyListDto[];
};

export type DiscoveryMapPreviewProps = {
  id: number;
  onClose: () => void;
  properties: PropertyListDto[];
  searchParams: PropertyCardSearchParams;
};

export type DiscoveryMapSheetProps = {
  label: string;
  onClose: () => void;
  isFilterOpen: boolean;
  onCloseFilters: () => void;
  children: (close: () => void) => ReactNode;
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
