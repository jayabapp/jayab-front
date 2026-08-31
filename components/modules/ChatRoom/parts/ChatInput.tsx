import type { ChatInputProps } from "@/types/components/modules/chat";

import TextareaAutosize from "react-textarea-autosize";
import _STRINGS from "@/utils/LocalStrings";

const ChatInput = ({
  value,
  maxRows,
  onFocus,
  padding,
  inputRef,
  onChangeText,
  placeholder,
}: ChatInputProps) => {
  const direction =
    value.length === 0 || /^[\u0600-\u06FF\s]/.test(value) ? "rtl" : "ltr";

  return (
    <div className="relative flex min-h-[60px] w-full items-center">
      <TextareaAutosize
        onFocus={() => {
          onFocus?.();
          inputRef.current?.scrollIntoView();
        }}
        ref={inputRef}
        rows={1}
        placeholder={placeholder ?? _STRINGS.CHAT_INPUT_PLACEHOLDER}
        className={`relative my-0 w-full rounded-lg border-0 bg-white ${padding ?? "p-2"} `}
        onChange={(event) => onChangeText(event.target.value)}
        value={value}
        minRows={1}
        maxRows={maxRows}
        style={{ direction, resize: "none" }}
      />
    </div>
  );
};

export default ChatInput;
