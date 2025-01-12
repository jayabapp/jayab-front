import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

import FormInput from "../shared/Form/FormInput";
import _STRINGS from "@/utils/LocalStrings";

import ChatProductReply from "./ChatProductReply";
import { useMutation } from "@tanstack/react-query";
import { ChatService } from "@/api_services/chat/chat.service";
import { isIOS } from "react-device-detect";
import BtnLoading from "../shared/Button/BtnLoading";
import ChatInput from "./ChatInput";
import dynamic from "next/dynamic";
import ChatReply from "./ChatReply";
import { NewSingleChatDto, SingleChatDetailsDto } from "@/api_services/chat/chat.interface";
import { debounce } from "lodash";
import { useChatStore, useStoreSocket } from "@/store";
import ChatUploader from "../uploader/ChatUploader";
const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);
export interface ChatFooterTypes {
  showProduct: boolean;
  keyoard: boolean;
  chatId: string | number;
  product?: any | null;
  cancleButton?: () => void | null;
  callback?: () => void | null;
  setKeyboard: (e: boolean) => void | null;
  scrollToBottom: () => void | null;
  setRefresher: (e: (e: boolean) => boolean) => void | null;
  singleChatData?: SingleChatDetailsDto;
  setCursor: (e: number) => void | null;
  setData: React.Dispatch<React.SetStateAction<[] | any[]>>;
}

const ChatFooter = ({
  product,
  cancleButton,
  chatId,
  showProduct,
  setCursor,
  setRefresher,
  scrollToBottom,
  setKeyboard,
  keyoard,
  callback,
  singleChatData,
  setData,
}: ChatFooterTypes) => {
  const [isTyping, setIsTyping] = useState<boolean | null>(false);
  const { chatReply } = useChatStore((state) => state);
  const { socket } = useStoreSocket((state) => state);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState<any>(null);
  const { connecting } = useStoreSocket((state) => state);
  const { mutate: sendMessage, isPending: sedLoading } = useMutation({
    mutationFn: ChatService.SendMessage,
    onSuccess: (d) => {
      setText("");

      // setCursor(0);
      // setRefresher((e) => !e);
      if (!!d?.message) {
        setData((e) => [...e, d?.message]);
      }
      if (keyoard) {
        scrollToBottom();
      }
      if (product && cancleButton) {
        cancleButton();
      }
    },
  });

  // const checkTyping = useCallback(
  //   debounce(() => {
  //     setisTyping("false");
  //   }, 3000),
  //   []
  // );

  // useEffect(() => {
  //   if (!!text) {
  //     setisTyping("true");
  //     checkTyping();
  //   } else {
  //     setisTyping("false");
  //   }
  // }, [text]);

  const checkIsTyping = useCallback(
    debounce(() => {
      setIsTyping(false);
    }, 3000),
    []
  );

  useEffect(() => {
    if (!!socket && chatId) {
      socket.emit("chat:is-typing", {
        chatroom_id: chatId,
        is_typing: isTyping,
        participant_id: singleChatData?.self?.participant_id,
      });
    }
  }, [isTyping, socket, !!chatId]);

  // useEffect(() => {
  //   if (!!socket && singleChatData) {
  //     if (!!text && isTyping == "true") {
  //       socket.emit("chat:is-typing", {
  //         chatroom_id: chatId,
  //         is_typing: true,
  //         participant_id: singleChatData?.self?.participant_id,
  //       });
  //     } else if (isTyping == "false") {
  //       socket.emit("chat:is-typing", {
  //         chatroom_id: chatId,
  //         is_typing: false,
  //         participant_id: singleChatData?.self?.participant_id,
  //       });
  //     }
  //   }
  // }, [isTyping, socket, !!singleChatData]);

  const submit = () => {
    if ((text || !!image) && chatId) {
      const body: { id: string | number; text: string; media_id?: number } = { id: chatId, text };
      if (!!image) {
        body.media_id = Number(image?.id);
      }
      sendMessage(body);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", _onKeyDown);
    return () => {
      document.removeEventListener("keydown", _onKeyDown);
    };
  }, []);

  const _onKeyDown = (e: KeyboardEvent) => {
    if (e?.code == "Enter") {
      return submit();
    }
  };

  useEffect(() => {
    if (keyoard) {
      scrollToBottom();
    }
  }, [keyoard]);

  const cancelReply = () => {
    useChatStore.setState({ chatReply: null });
  };
  const handleTextChange = (e: string) => {
    setText(e);
    setIsTyping(true);
    checkIsTyping();
  };
  return (
    <div
      onClick={() => {
        setKeyboard(true);
      }}
      onBlur={() => {
        setKeyboard(false);
      }}
      className={` flex px-2  flex-1 z-30 w-full left-0 border-b   ${
        isIOS ? " bottom-0   " : "bottom-[0]   pb-1"
      }  h-fit  transition-all duration-100 ease-in-out  absolute  overflow-clip     left-0   flex-col  bg-white  dark:bg-dark-700 ${
        product && showProduct ? " pb-4 !h-36 bottom-0" : ""
      }`}
    >
      {chatReply ? <ChatReply data={chatReply} cancleButton={cancelReply} /> : <></>}
      <div
        className={` ${isIOS ? "!h-16" : ""} flex   bg-white  dark:bg-dark-700  w-full   h-full  items-center gap-1  `}
      >
        <div
          onMouseDown={(e) => {
            if (!sedLoading || !connecting) {
              e.preventDefault();
              submit();
            }
          }}
          className="px-2 aspect-square flex items-center justify-center cursor-pointer"
        >
          {" "}
          {sedLoading ? (
            <BtnLoading />
          ) : (
            <div
              className={`w-8 ${
                text && !connecting ? "opacity-100" : "opacity-50 grayscale "
              }  aspect-square rounded-full flex items-center justify-center bg-primary-700  dark:invert`}
            >
              {" "}
              <img
                tabIndex={1}
                className={`  transition-all  w-4 aspect-square   duration-200 ease-in-out text-lightBlue-100`}
                src="/assets/icons/chat/chat_arrow_head.svg"
              />
            </div>
          )}
        </div>

        <ChatInput
          onFocus={() => {
            setShowEmojiPicker(false);
            if (callback) callback();
          }}
          maxRows={product && showProduct ? 1 : 4}
          onChangeText={handleTextChange}
          value={text}
        />

        <div className="flex items-center gap-1">
          {showEmojiPicker ? (
            <img
              src="/assets/icons/chat/smily_face.svg"
              alt="XMarkIcon"
              onClick={() => setShowEmojiPicker(false)}
              className="w-4 text-gray-500 h-4 md:!w-6 md:!h-6 "
            />
          ) : (
            <img
              src="/assets/icons/chat/smily_face.svg"
              alt="FaceSmileIcon"
              onClick={() => setShowEmojiPicker(true)}
              className="w-4 text-gray-500 h-4  md:!w-6 md:!h-6 "
            />
          )}
          <ChatUploader
            withCrop
            chatId={chatId}
            link={"/attachments?type=CHAT"}
            containerClass={"my-3"}
            item={image}
            onSelect={(file) => {
              setImage(file);
            }}
            onDelete={() => {
              setImage(null);
            }}
            sendMessage={sendMessage}
          />{" "}
        </div>
      </div>

      <div className={`  ${showEmojiPicker ? " is-opend " : ""} accardion-class    ease-in-out w-full duration-500 `}>
        <div>
          <EmojiPicker
            previewConfig={{ showPreview: false }}
            height={`50dvh`}
            skinTonesDisabled={true}
            onEmojiClick={(e) => {
              setText((t) => `${t}${e?.emoji}`);
            }}
            lazyLoadEmojis={true}
            searchDisabled
            className={"!w-full     !p-0 !border-none !bg-transparent"}
            open={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatFooter;
