import { useTranslations } from "next-intl";

import type { ChatInputProps } from "@/types/components/modules/chat";

import TextareaAutosize from "react-textarea-autosize";

const ChatInput = ({
  value,
  maxRows,
  onFocus,
  padding,
  inputRef,
  onChangeText,
  placeholder,
}: ChatInputProps) => {
  const t = useTranslations("chat");

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
        minRows={1}
        value={value}
        maxRows={maxRows}
        style={{ direction, resize: "none" }}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder={placeholder ?? t("chatInputPlaceholder")}
        className={`relative my-0 w-full rounded-lg border-0 bg-white ${padding ?? "p-2"} `}
      />
    </div>
  );
};

export default ChatInput;
