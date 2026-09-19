"use client";

import type { ReserveSuccessProps } from "@/types/components/modules/property-contact";
import { Icon } from "@elements/Icon";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const ACTION_CLASS =
  "flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-10 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const ReserveSuccess = ({
  onChat,
  onCall,
  onClose,
  created,
  isExpired,
  isChatPending,
}: ReserveSuccessProps) => (
  <div
    role="status"
    className="flex flex-col items-center gap-4 p-6 text-center"
  >
    <span className="flex size-12 items-center justify-center rounded-full bg-success-50 text-success-600">
      <Icon name="check" size={24} />
    </span>

    <div className="flex flex-col gap-2">
      <p className="text-base font-bold text-success-600">
        {created
          ? _STRINGS.RESERVE_SENT_TITLE
          : _STRINGS.RESERVE_ALREADY_SENT_TITLE}
      </p>
      <p className="text-sm text-neutral-600">
        {isExpired
          ? _STRINGS.RESERVE_SENT_EXPIRED_BODY
          : _STRINGS.RESERVE_SENT_BODY}
      </p>
    </div>

    {isExpired ? null : (
      <div className="flex w-full gap-2">
        <button
          type="button"
          onClick={onCall}
          className={`${ACTION_CLASS} bg-brand-600 text-white hover:bg-brand-700`}
        >
          <Icon name="phone" size={20} />
          {_STRINGS.CALL_HOST}
        </button>
        {onChat ? (
          <button
            type="button"
            onClick={onChat}
            disabled={isChatPending}
            className={`${ACTION_CLASS} border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50`}
          >
            <Icon name="chat" size={20} />
            {_STRINGS.CHAT_IN_JAYAB}
          </button>
        ) : null}
      </div>
    )}

    <div className="flex items-center gap-4 text-sm">
      <Link
        href="/profile/reserves"
        className="flex items-center gap-1 text-brand-700"
      >
        {_STRINGS.MY_REQUESTS}
        <Icon name="chevron-left" size={16} />
      </Link>
      <button
        type="button"
        onClick={onClose}
        className="cursor-pointer text-neutral-500 hover:text-neutral-900"
      >
        {_STRINGS.CLOSE}
      </button>
    </div>
  </div>
);

export default ReserveSuccess;
