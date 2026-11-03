"use client";

import type { ContactActionsProps } from "@/types/components/modules/property-contact";
import type { ContactFlowAction } from "@/types/components/modules/property-contact";
import type { ContactActionItem } from "@/types/components/modules/property-contact";

import { useTranslations } from "next-intl";
import { useContactFlow } from "./ContactFlow.client";
import { Icon } from "@elements/Icon";

const BUTTON_BASE =
  "flex cursor-pointer items-center justify-center rounded-10 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const CARD_BUTTON = `${BUTTON_BASE} h-12 w-full gap-2 text-sm`;
const BAR_BUTTON = `${BUTTON_BASE} h-14 min-w-0 flex-1 flex-col gap-1 px-1 text-xs`;
const BAR_SINGLE_BUTTON = `${BUTTON_BASE} h-11 w-full gap-2 text-base`;
const PRIMARY_TONE = "bg-action text-on-action hover:bg-action-hover";
const SECONDARY_TONE =
  "border border-line bg-surface text-ink hover:bg-surface-muted";

const ContactActions = ({ context, property }: ContactActionsProps) => {
  const t = useTranslations();

  const { isChatPending, start } = useContactFlow();
  const isExpired = !property.remainingDays;
  const isBar = context.variant === "bar";
  const canChat = property.isChatEnabled && !isExpired;

  const items: ContactActionItem[] = isExpired
    ? [
        {
          action: "reserve",
          barLabel: t("reserve.reserveRequestAction"),
          icon: "calendar",
          isPrimary: true,
          label: t("reserve.reserveRequestAction"),
        },
      ]
    : [
        {
          action: "call",
          barLabel: t("common.call"),
          icon: "phone",
          isPrimary: true,
          label: t("reserve.callHost"),
        },
        {
          action: "sms",
          barLabel: t("common.sms"),
          icon: "sms",
          label: t("common.sms"),
        },
        {
          action: "reserve",
          barLabel: t("reserve.reserveRequestAction"),
          icon: "calendar",
          label: t("reserve.reserveRequestAction"),
        },
        ...(canChat
          ? [
              {
                action: "chat" as const,
                barLabel: t("reserve.chatInJayab"),
                icon: "chat" as const,
                label: t("reserve.chatInJayab"),
              },
            ]
          : []),
      ];

  const onAction = (action: ContactFlowAction) =>
    start(action, {
      endDate: context.endDate,
      guests: context.guests,
      nights: context.nights,
      onEdit: context.onEdit,
      startDate: context.startDate,
      total: context.total,
    });

  if (isBar)
    return (
      <div className="flex gap-2">
        {items.map((item) => (
          <button
            type="button"
            key={item.action}
            onClick={() => onAction(item.action)}
            disabled={item.action === "chat" && isChatPending}
            className={`${items.length === 1 ? BAR_SINGLE_BUTTON : BAR_BUTTON} ${item.isPrimary ? PRIMARY_TONE : SECONDARY_TONE}`}
          >
            <Icon name={item.icon} size={20} />
            <span className="max-w-full truncate">{item.barLabel}</span>
          </button>
        ))}
      </div>
    );

  const isOdd = items.length % 2 === 1;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-bold text-ink">
        {isExpired
          ? t("reserve.contactHostTitleExpired")
          : t("reserve.contactHostTitle")}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.action}
            onClick={() => onAction(item.action)}
            disabled={item.action === "chat" && isChatPending}
            className={`${CARD_BUTTON} ${item.isPrimary ? PRIMARY_TONE : SECONDARY_TONE} ${isOdd && index === items.length - 1 ? "col-span-2" : ""}`}
          >
            <Icon name={item.icon} size={20} />
            {item.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-ink-subtle">
        {isExpired
          ? t("reserve.expiredRequestNote")
          : t("reserve.directCoordinationNote")}
      </p>
    </div>
  );
};

export default ContactActions;
