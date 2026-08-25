import type { TicketMessageProps } from "@/types/features/support/components";

import _STRINGS from "@/utils/LocalStrings";
import moment from "moment-jalaali";

const Message = ({ item }: TicketMessageProps) => (
  <div
    className={`w-full rounded-lg p-4 text-white ${
      item?.by_admin
        ? "bg-primary-700/75 dark:border dark:border-zinc-300 dark:bg-zinc-700"
        : "bg-zinc-200 !text-zinc-500 dark:bg-zinc-800 dark:text-zinc-200"
    }`}
  >
    {item?.by_admin ? (
      <p className="pb-2 text-sm text-gray-300">{_STRINGS.ADMIN_RESPOND}</p>
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

export default Message;
