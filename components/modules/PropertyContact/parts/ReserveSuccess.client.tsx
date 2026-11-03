"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@elements/Icon";

import type { ReserveSuccessProps } from "@/types/components/modules/property-contact";

import Link from "next/link";

const ACTION_CLASS =
  "flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-10 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const ReserveSuccess = ({
  onChat,
  onCall,
  onSms,
  onClose,
  created,
  isExpired,
  isChatPending,
}: ReserveSuccessProps) => {
  const t = useTranslations();

  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 p-6 text-center"
    >
      <span className="success-pop flex size-12 items-center justify-center rounded-full bg-status-success-bg text-status-success">
        <Icon name="check" size={24} />
      </span>

      <div className="flex flex-col gap-2">
        <p className="text-base font-bold text-status-success">
          {created
            ? t("reserve.reserveSentTitle")
            : t("reserve.reserveAlreadySentTitle")}
        </p>
        <p className="text-sm text-ink-muted">
          {isExpired
            ? t("reserve.reserveSentExpiredBody")
            : t("reserve.reserveSentBody")}
        </p>
      </div>

      {isExpired ? null : (
        <div className="flex w-full gap-2">
          <button
            type="button"
            onClick={onCall}
            className={`${ACTION_CLASS} bg-action text-on-action hover:bg-action-hover`}
          >
            <Icon name="phone" size={20} />
            {t("reserve.callHost")}
          </button>
          {onSms ? (
            <button
              type="button"
              onClick={onSms}
              className={`${ACTION_CLASS} border border-line bg-surface text-ink hover:bg-surface-muted`}
            >
              <Icon name="sms" size={20} />
              {t("common.sms")}
            </button>
          ) : null}
          {onChat ? (
            <button
              type="button"
              onClick={onChat}
              disabled={isChatPending}
              className={`${ACTION_CLASS} border border-line bg-surface text-ink hover:bg-surface-muted`}
            >
              <Icon name="chat" size={20} />
              {t("reserve.chatInJayab")}
            </button>
          ) : null}
        </div>
      )}

      <div className="flex items-center gap-4 text-sm">
        <Link
          href="/profile/reserves"
          className="flex items-center gap-1 text-link"
        >
          {t("reserve.myRequests")}
          <Icon name="chevron-left" size={16} className="ltr:rotate-180" />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer text-ink-subtle hover:text-ink"
        >
          {t("common.close")}
        </button>
      </div>
    </div>
  );
};

export default ReserveSuccess;
