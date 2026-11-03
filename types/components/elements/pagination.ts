export type PaginationProps = {
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number | string) => void | null;
  onClickPrev: () => void | null;
  onClickNext: () => void | null;
};
export type ServerSidePaginationProps = Pick<PaginationProps, "totalCount" | "siblingCount" | "currentPage" | "pageSize"> & {
  q?: string;
  query?: Record<string, unknown>;
};
export type UsePaginationProps = Pick<PaginationProps, "totalCount" | "pageSize" | "siblingCount" | "currentPage"> & { siblingCount: number };
export type PaginationArrowProps = { direction: "left" | "right" };
