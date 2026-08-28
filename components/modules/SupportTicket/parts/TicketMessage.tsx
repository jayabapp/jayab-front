import type { TicketMessageProps } from "@/types/features/support/components";

import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

const TicketMessage = ({ item }: TicketMessageProps) => (
  <div
    className={`w-full rounded-lg p-4 text-white ${
      item?.by_admin
        ? "bg-brand-600/75   "
        : "bg-neutral-200 !text-neutral-500  "
    }`}
  >
    {item?.by_admin ? (
      <p className="pb-2 text-sm text-neutral-300">{_STRINGS.ADMIN_RESPOND}</p>
    ) : null}
    <div className="flex items-center gap-2">
      <p className="text-sm font-light">
        {moment(item?.created_at).format(" HH:mm ")}
      </p>
      <p className="text-sm font-light">
        {moment(item?.created_at).format("jYYYY/jMM/jDD ")}
      </p>
    </div>
    <div className="flex flex-col gap-y-2">
      {item && "title" in item ? (
        <p className="line-clamp-1 flex max-w-[50%] font-bold">{item.title}</p>
      ) : null}
      <p className="whitespace-pre-line">{item?.message}</p>
    </div>
  </div>
);

export default TicketMessage;
