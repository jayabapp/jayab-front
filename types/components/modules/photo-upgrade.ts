import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { PhotoUpgradeRequestDto, PhotoUpgradeRequestItemDto } from "@/api_services/photo-upgrade/photo-upgrade.interface";
import type { PropertyListDto, PropertySubsDto, SingleOwnerPropertyDto } from "@/api_services/property/property.interface";

export type PhotoUpgradeSummaryItemProps = {
  title: string;
  value: number | string;
};

export type SelectablePhotoUpgradeImageProps = {
  image: ImageDto;
  isSelected: boolean;
  onToggle: (imageId: number) => void;
};

export type OwnerPhotoUpgradeModalProps = {
  extraPrice?: number;
  mutationOptions?: {
    promote_id?: number;
    redirect_url?: string;
    subscription_id?: number;
  };
  noImageSubmit?: () => void;
  onHide: () => void;
  onHideClick?: () => void;
  property: PropertyListDto | SingleOwnerPropertyDto | null;
  selectedPlans?: PropertySubsDto[];
};

export type PhotoUpgradeImageBoxProps = {
  cb?: () => void | null;
  emptyTitle?: string;
  image?: ImageDto | null;
  title: string;
};

export type PhotoUpgradeImagePairProps = {
  index: number;
  item: PhotoUpgradeRequestItemDto;
};

export type PhotoUpgradeInfoItemProps = {
  title: string;
  value: number | string;
};

export type PhotoUpgradeRequestCardProps = {
  data: PhotoUpgradeRequestDto;
};
export type PhotoUpgradeImage = ImageDto;
export type PhotoUpgradeItem = PhotoUpgradeRequestItemDto;
