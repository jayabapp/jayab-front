import type { PaginationArrowProps } from "@/types/components/elements/pagination";

const PaginationArrow = ({ direction }: PaginationArrowProps) => (
  <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default PaginationArrow;
