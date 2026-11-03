"use client";

import { useSwitchChatAccount } from "@features/chat/hooks/useSwitchChatAccount";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import type { ChatAccessDeniedProps } from "@/types/components/modules/chat";

const ChatAccessDenied = ({ chatId }: ChatAccessDeniedProps) => {
  const t = useTranslations("chat");

  const router = useRouter();
  const switchAccount = useSwitchChatAccount(chatId);

  return (
    <div className="container flex min-h-[60dvh] flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-20 border border-line bg-surface p-6 text-center shadow-surface">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-status-warning-bg text-2xl"
          aria-hidden="true"
        >
          !
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-ink">
            {t("chatAccountMismatchTitle")}
          </p>
          <p className="text-sm leading-7 text-ink-muted">
            {t("chatAccountMismatch")}
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            className="rounded-xl bg-action px-4 py-2.5 text-sm font-medium text-on-action"
            onClick={() => void switchAccount()}
            type="button"
          >
            {t("loginWithOtherNumber")}
          </button>
          <button
            className="rounded-xl border border-line-strong px-4 py-2.5 text-sm font-medium text-ink-muted"
            onClick={() => router.replace("/chat")}
            type="button"
          >
            {t("backToChats")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAccessDenied;
