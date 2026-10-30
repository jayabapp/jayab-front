import type { PropertyCardSearchParams } from "@/types/components/modules/property-grid";
import type { PropertyListDto } from "@/api_services/property/property.interface";
import type { ReactNode } from "react";

export type DiscoveryMapVariant = "column" | "background";

type DiscoveryQuery = Record<string, any>;

export type DiscoveryMapHostProps = {
  query: DiscoveryQuery;
};

export type DiscoveryMobileMapProps = {
  header: ReactNode;
  children: ReactNode;
  query: DiscoveryQuery;
};

export type DiscoveryMapProps = {
  onClose: () => void;
  bottomInset?: number;
  query: DiscoveryQuery;
  isListSettled: boolean;
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
