import type { TicketStatusProps } from "@/types/features/support/components";

const TicketStatus = ({ status }: TicketStatusProps) => (
  <p
    className={`rounded-5 px-2 py-1 text-sm ${
      status === 1 || status === 2 ? "bg-success-50 text-success-600" : status === 3 ? "bg-danger-50 text-danger-500" : ""
    }`}
  >
    {status === 1 ? "منتظر پاسخ" : status === 2 ? "پاسخ داده شده" : status === 3 ? "بسته" : ""}
  </p>
);

export default TicketStatus;
