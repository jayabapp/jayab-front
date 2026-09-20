"use client";

import { useContactFlow } from "@modules/PropertyContact";
import { Icon } from "@elements/Icon";

import type { PropertyDetailsView } from "@/types/features/properties";

import _STRINGS from "@/utils/LocalStrings";

const ACTION_CLASS =
  "flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

const HostActions = ({ property }: { property: PropertyDetailsView }) => {
  const { isChatPending, start } = useContactFlow();
  const isExpired = !property.remainingDays;

  if (isExpired) return null;
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => start("call")}
        className={`${ACTION_CLASS} bg-brand-600 text-white hover:bg-brand-700`}
      >
        <Icon name="phone" size={20} />
        {_STRINGS.CALL_HOST}
      </button>
      {property.isChatEnabled ? (
        <button
          type="button"
          onClick={() => start("chat")}
          disabled={isChatPending}
          className={`${ACTION_CLASS} border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50`}
        >
          <Icon name="chat" size={20} />
          {_STRINGS.CHAT_WITH_HOST}
        </button>
      ) : null}
    </div>
  );
};

export default HostActions;
