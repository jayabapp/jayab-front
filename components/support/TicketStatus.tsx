import type { TicketStatusProps } from "@/types/features/support/components";

const TicketStatus = ({ status }: TicketStatusProps) => (
  <p
    className={`rounded-5 px-2 py-1 text-sm ${
      status === 1 || status === 2 ? "bg-[#C3F3D7] text-[#098F41]" : status === 3 ? "bg-[#FFE0E3] text-[#FF4858]" : ""
    }`}
  >
    {status === 1 ? "منتظر پاسخ" : status === 2 ? "پاسخ داده شده" : status === 3 ? "بسته" : ""}
  </p>
);

export default TicketStatus;
