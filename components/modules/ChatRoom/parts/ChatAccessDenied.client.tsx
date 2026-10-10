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
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-20 border border-neutral-200 bg-white p-6 text-center shadow-card">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl"
          aria-hidden="true"
        >
          !
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold text-neutral-900">
            {t("chatAccountMismatchTitle")}
          </p>
          <p className="text-sm leading-7 text-neutral-600">
            {t("chatAccountMismatch")}
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white"
            onClick={() => void switchAccount()}
            type="button"
          >
            {t("loginWithOtherNumber")}
          </button>
          <button
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700"
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
