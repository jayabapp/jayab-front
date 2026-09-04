import type { TChatFooterTypes } from "@/types/components/modules/property-map";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { useSendMessage } from "@features/chat/hooks/useSendMessage";
import { ChatUploadField } from "@modules/PropertyMedia";
import { useChatStore, useStoreSocket } from "@/store";
import { BtnLoading } from "@elements/Button";
import { isIOS } from "react-device-detect";

import ExpiredPropertyModal from "./ExpiredPropertyModal.client";
import randomId from "@/helpers/randomId";
import debounce from "lodash/debounce";
import ChatInput from "./ChatInput";
import ChatReply from "./ChatReply";
import dynamic from "next/dynamic";
import Image from "next/image";

const EmojiPicker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: true },
);

const ChatFooter = ({
  chatId,
  product,
  showProduct,
  cancleButton,
  singleChatData,
}: TChatFooterTypes) => {
  const [showExpired, setShowExpired] = useState(false);
  const [isTyping, setIsTyping] = useState<boolean | null>(false);
  const { chatReply } = useChatStore((state) => state);
  const { socket } = useStoreSocket((state) => state);
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const submittingRef = useRef(false);
  const { connecting } = useStoreSocket((state) => state);

  const sendMessageMutation = useSendMessage(
    `${chatId}`,
    singleChatData?.self?.participant_id,
  );
  const { mutate: sendMessage, isPending: sedLoading } = sendMessageMutation;

  const typingDebounce = useMemo(
    () =>
      debounce(() => {
        setIsTyping(false);
      }, 3000),
    [],
  );

  useEffect(() => () => typingDebounce.cancel(), [typingDebounce]);

  useEffect(
    () => () => {
      if (socket && chatId) {
        socket.emit("chat:is-typing", {
          chatroom_id: chatId,
          is_typing: false,
          participant_id: singleChatData?.self?.participant_id,
        });
      }
    },
    [chatId, singleChatData?.self?.participant_id, socket],
  );

  const handleSendSuccess = () => {
    submittingRef.current = false;
    setText("");
    setImage(null);
    inputRef?.current?.blur();
    if (product && cancleButton) cancleButton();
  };

  const handleSendError = (e: any) => {
    submittingRef.current = false;
    if (e?.message_code == "CHAT10") setShowExpired(true);
  };

  useEffect(() => {
    if (!!socket && chatId) {
      socket.emit("chat:is-typing", {
        chatroom_id: chatId,
        is_typing: isTyping,
        participant_id: singleChatData?.self?.participant_id,
      });
    }
  }, [chatId, isTyping, singleChatData?.self?.participant_id, socket]);

  const submit = () => {
    if (submittingRef.current || connecting || sedLoading) return;
    if (
      !!singleChatData?.property?.is_expired &&
      singleChatData?.self?.user_id == singleChatData?.property?.owner?.user?.id
    )
      return setShowExpired(true);
    const normalizedText = text.trim();
    if ((normalizedText || !!image) && chatId) {
      submittingRef.current = true;
      const body: { id: string | number; text: string; media_id?: number } = {
        id: chatId,
        text: normalizedText,
      };
      if (!!image) body.media_id = Number(image?.id);
      sendMessage(
        { ...body, clientMessageId: randomId() },
        { onSuccess: handleSendSuccess, onError: handleSendError },
      );
    }
  };

  const submitEvent = useEffectEvent(submit);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitEvent();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const cancelReply = () => {
    useChatStore.setState({ chatReply: null });
  };
  const handleTextChange = (e: string) => {
    setText(e);
    setIsTyping(true);
    typingDebounce();
  };
  return (
    <div
      className={` flex px-2  flex-1 z-30 w-full left-0 border-b   ${
        isIOS ? " bottom-0   " : "bottom-[0]   pb-1"
      }  h-fit  transition-all duration-100 ease-in-out  absolute  overflow-clip     left-0   flex-col  bg-white   ${
        product && showProduct ? " pb-4 !h-36 bottom-0" : ""
      }`}
    >
      {chatReply ? (
        <ChatReply data={chatReply} cancleButton={cancelReply} />
      ) : (
        <></>
      )}
      <div
        className={` ${isIOS ? "!h-16" : ""} flex   bg-white    w-full   h-full  items-center gap-1  `}
      >
        <div
          onMouseDown={(e) => {
            if (!sedLoading && !connecting) {
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
                (text.trim() || image) && !connecting
                  ? "opacity-100"
                  : "opacity-50 grayscale "
              }  aspect-square rounded-full flex items-center justify-center bg-brand-600  `}
            >
              {" "}
              <Image
                tabIndex={1}
                className={`  transition-all  w-4 aspect-square   duration-200 ease-in-out text-lightBlue-100`}
                src="/assets/icons/chat/chat_arrow_head.svg"
                alt="ارسال"
                width={16}
                height={16}
              />
            </div>
          )}
        </div>

        <ChatInput
          value={text}
          inputRef={inputRef}
          onChangeText={handleTextChange}
          maxRows={product && showProduct ? 1 : 4}
          onFocus={() => {
            setShowEmojiPicker(false);
          }}
        />

        <div className="flex shrink-0 items-center gap-1">
          {showEmojiPicker ? (
            <Image
              width={24}
              height={24}
              alt="XMarkIcon"
              src="/assets/icons/chat/smily_face.svg"
              onClick={() => setShowEmojiPicker(false)}
              className="w-5 text-neutral-500 h-5 md:!w-6 md:!h-6 "
            />
          ) : (
            <Image
              width={24}
              height={24}
              alt="FaceSmileIcon"
              src="/assets/icons/chat/smily_face.svg"
              onClick={() => setShowEmojiPicker(true)}
              className="w-5 text-neutral-500 h-5  md:!w-6 md:!h-6 "
            />
          )}
          <ChatUploadField
            withCrop
            item={image}
            chatId={chatId}
            containerClass={"my-3"}
            sendMessage={(body, options) =>
              sendMessage(
                { ...body, clientMessageId: randomId() },
                {
                  onSuccess: (response) => {
                    submittingRef.current = false;
                    handleSendSuccess();
                    options?.onSuccess?.(response);
                  },
                  onError: (error) => {
                    handleSendError(error);
                    options?.onError?.(error);
                  },
                },
              )
            }
            link={"/attachments?type=CHAT"}
            onSelect={(file) => {
              setImage(file);
            }}
            onDelete={() => {
              setImage(null);
            }}
          />{" "}
        </div>
      </div>

      <div
        className={`  ${showEmojiPicker ? " is-opend " : ""} accardion-class    ease-in-out w-full duration-500 `}
      >
        <div>
          <EmojiPicker
            open={true}
            searchDisabled
            height={`50dvh`}
            lazyLoadEmojis={true}
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
            className={"!w-full !p-0 !border-none !bg-transparent !h-[50dvh]"}
            onEmojiClick={(e) => {
              setText((t) => `${t}${e?.emoji}`);
            }}
          />
        </div>
      </div>
      <ExpiredPropertyModal
        visibleModal={showExpired}
        singleChatData={singleChatData}
        setVisibleModal={setShowExpired}
      />
    </div>
  );
};

export default ChatFooter;
