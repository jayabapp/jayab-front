import type {
  ChatListDto,
  NewSingleChatDto,
  SingleChatDetailsDto,
  SingleChatDto,
} from "@/api_services/chat/chat.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { RefObject } from "react";

export type ChatListProps = { profile?: boolean };
export type ChatListItemProps = {
  item: ChatListDto;
  onClickCb?: () => void;
};
export type ChatRoomProps = { chatId: string };
export type ChatAccessDeniedProps = { chatId: string };
export type ChatBodyProps = {
  hasNextPage: boolean;
  data: NewSingleChatDto[];
  isFetchingNextPage: boolean;
  singleChatData: SingleChatDetailsDto;
  fetchNextPage: () => Promise<unknown>;
};
export type ChatHeaderProps = {
  name?: string;
  image?: ImageDto;
  offSetTop?: number;
  description?: string;
  data?: SingleChatDetailsDto;
  is_recipient_online?: boolean;
};
export type ChatInputProps = {
  value: string;
  maxRows: number;
  padding?: string;
  placeholder?: string;
  onFocus?: () => void;
  onChangeText: (value: string) => void;
  inputRef: RefObject<HTMLTextAreaElement | null>;
};
export type ChatMediaProps = {
  src: string;
  show: boolean;
  onClose: () => void;
};
export type ChatMessageItemProps = { data: NewSingleChatDto };
export type ChatReplyProps = {
  data: SingleChatDto;
  cancleButton: () => void;
};
export type ExpiredPropertyProps = {
  visibleModal: boolean;
  singleChatData?: SingleChatDetailsDto;
  setVisibleModal: (visible: boolean) => void;
};
