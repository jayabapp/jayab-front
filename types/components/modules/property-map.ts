import type { SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import type { SearchedLocation } from "@/types/features/map";

export type PropertyLocationMapProps = {
  center: number[];
  containerClass?: string;
  disableCenter?: boolean;
  setCenter?: (center: number[]) => void;
  setCenterAddress?: (address: string) => void;
  setCenterAddressLoading?: (loading: boolean) => void;
  jumpToState?: { lat: string | number; lng: string | number } | null;
};

export type SearchPlaceModalProps = {
  center: number[];
  setJumpTo: React.Dispatch<
    React.SetStateAction<{ lat: string | number; lng: string | number } | null>
  >;
  setShow: (show: boolean) => void;
  show: boolean;
  title: string;
};

export type SearchedLocationItemProps = {
  item: SearchedLocation;
  locationClickFunc: (location: SearchedLocation) => void;
};

export type TChatFooterTypes = {
  showProduct: boolean;
  product?: any | null;
  chatId: string | number;
  cancleButton?: () => void | null;
  singleChatData?: SingleChatDetailsDto;
};
