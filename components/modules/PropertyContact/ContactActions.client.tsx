"use client";

import type { ContactActionsProps } from "@/types/components/modules/property-contact";
import type { ContactFlowAction } from "@/types/components/modules/property-contact";
import type { ContactActionItem } from "@/types/components/modules/property-contact";

import { useContactFlow } from "./ContactFlow.client";
import { Icon } from "@elements/Icon";

import _STRINGS from "@/utils/LocalStrings";

const BUTTON_BASE =
  "flex cursor-pointer items-center justify-center rounded-10 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
const CARD_BUTTON = `${BUTTON_BASE} h-12 w-full gap-2 text-sm`;
const BAR_BUTTON = `${BUTTON_BASE} h-14 min-w-0 flex-1 flex-col gap-1 px-1 text-xs`;
const BAR_SINGLE_BUTTON = `${BUTTON_BASE} h-11 w-full gap-2 text-base`;
const PRIMARY_TONE = "bg-brand-600 text-white hover:bg-brand-700";
const SECONDARY_TONE =
  "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50";

const ContactActions = ({ context, property }: ContactActionsProps) => {
  const { isChatPending, start } = useContactFlow();
  const isExpired = !property.remainingDays;
  const isBar = context.variant === "bar";
  const canChat = property.isChatEnabled && !isExpired;

  const items: ContactActionItem[] = isExpired
    ? [
        {
          action: "reserve",
          barLabel: _STRINGS.RESERVE_REQUEST_ACTION,
          icon: "calendar",
          isPrimary: true,
          label: _STRINGS.RESERVE_REQUEST_ACTION,
        },
      ]
    : [
        {
          action: "call",
          barLabel: _STRINGS.CALL,
          icon: "phone",
          isPrimary: true,
          label: _STRINGS.CALL_HOST,
        },
        {
          action: "sms",
          barLabel: _STRINGS.SMS,
          icon: "sms",
          label: _STRINGS.SMS,
        },
        {
          action: "reserve",
          barLabel: _STRINGS.RESERVE_REQUEST_ACTION,
          icon: "calendar",
          label: _STRINGS.RESERVE_REQUEST_ACTION,
        },
        ...(canChat
          ? [
              {
                action: "chat" as const,
                barLabel: _STRINGS.CHAT_IN_JAYAB,
                icon: "chat" as const,
                label: _STRINGS.CHAT_IN_JAYAB,
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
      <p className="text-sm font-bold text-neutral-900">
        {isExpired
          ? _STRINGS.CONTACT_HOST_TITLE_EXPIRED
          : _STRINGS.CONTACT_HOST_TITLE}
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
      <p className="text-xs text-neutral-500">
        {isExpired
          ? _STRINGS.EXPIRED_REQUEST_NOTE
          : _STRINGS.DIRECT_COORDINATION_NOTE}
      </p>
    </div>
  );
};

export default ContactActions;
