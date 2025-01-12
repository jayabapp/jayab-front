import React, { useEffect, useState, useRef, useCallback, useMemo, LegacyRef } from "react";
import EmojiPicker from "emoji-picker-react";
import TextareaAutosize from "react-textarea-autosize";
import _STRINGS from "@/utils/LocalStrings";

const ChatInput = ({
  value,
  onChangeText,
  maxRows,
  placeholder,
  padding,
  onFocus,
}: {
  maxRows: number;
  value: string;
  placeholder?: string;
  padding?: string;
  onChangeText: (e: any) => void | null;
  onFocus?: () => void | null;
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [direction, setDirection] = useState<"ltr" | "rtl">("rtl");
  const [showEmergencySheet, setshowEmergencySheet] = useState(false);

  useEffect(() => {
    if (value?.length == 0) return setDirection("rtl");
    if (value?.length > 1) return;
    var p = /^[\u0600-\u06FF\s]+$/;
    if (value.match(p)) setDirection("rtl");
    else setDirection("ltr");
  }, [value]);

  const handleAttachClick = () => {
    fileInputRef?.current?.click();
  };

  // const handleFilePicker = (e) => {
  //   try {
  //     const file = e.target.files[0];
  //     if (!file || !file?.type?.includes("image")) return toast.error("لطفا از فایل تصویر استفاده نمایید");
  //     // onSendFile(file);
  //   } catch (error) {}
  // };

  // const onSelectEmoji = useCallback((emoji) => {
  //   setText((e) => e + " " + emoji + " ");
  // }, []);

  return (
    <div className="w-full !mt-0 !mb-0 relative flex items-center" style={{ minHeight: 60, maxWidth: "100%" }}>
      <>
        {/* <input className="d-none" type="file" id={`formFile`} ref={fileInputRef} onChange={handleFilePicker} /> */}

        {/* <EmojiPicker onSelect={onSelectEmoji} /> */}
        <TextareaAutosize
          onFocus={() => {
            if (!!onFocus) {
              onFocus();
            }
            inputRef.current?.scrollIntoView();
          }}
          ref={inputRef}
          rows={1}
          placeholder={placeholder ? placeholder : _STRINGS.CHAT_INPUT_PLACEHOLDER}
          className={`!bg-white dark:!bg-transparent   rounded-lg !border-0  ${
            padding ? padding : "p-2"
          }  !w-full  !mt-0 !mb-0 relative`}
          onChange={(e) => onChangeText(e.target.value)}
          value={value}
          minRows={1}
          maxRows={maxRows}
          style={{ direction: direction, resize: "none" }}
        />
        {/* SEND BUTTON */}
        {/* <div style={{ width: "6%" }}>
          {!text ? (
            <img src="/assets/icons/chat/attach.svg" onClick={handleAttachClick} />
          ) : (
            <button
              className={`btn ${!text ? "btn-gray-300" : "btn-primary"} btn-circle p-0 `}
              disabled={!text || isSending}
              onClick={() => onSendText(text)}
            >
              {isSending ? (
                  <div style={{ paddingTop: 6 }}>
                    <BtnLoading  />
                  </div>
                ) : (
                  <i className={`bi bi-arrow-right text-white`} style={{ fontSize: 16 }} />
                )}
            </button>
          )}
        </div> */}
      </>
    </div>
  );
};

export default ChatInput;
