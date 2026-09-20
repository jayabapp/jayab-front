"use client";

import { useContactFlow } from "@modules/PropertyContact/ContactFlow.client";
import type { PropertyDetailsView } from "@/types/features/properties";
import { Icon } from "@elements/Icon";

import ContactFlow from "@modules/PropertyContact/ContactFlow.client";

const HostActionButtons = ({ property }: { property: PropertyDetailsView }) => {
  const { isChatPending, start } = useContactFlow();
  const isExpired = !property.remainingDays;
  const now = new Date();
  const stay = { guests: 1, startDate: now, endDate: now, nights: 0, total: 0 };

  if (isExpired) return null;
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => start("call", stay)}
        className="flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        <Icon name="phone" size={18} /> تماس با میزبان
      </button>
      {property.isChatEnabled ? (
        <button
          type="button"
          onClick={() => start("chat", stay)}
          disabled={isChatPending}
          className="flex h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:opacity-60"
        >
          <Icon name="chat" size={18} /> گفت‌وگو با میزبان
        </button>
      ) : null}
    </div>
  );
};

const HostActions = ({ property }: { property: PropertyDetailsView }) => (
  <ContactFlow property={property}>
    <HostActionButtons property={property} />
  </ContactFlow>
);

export default HostActions;
