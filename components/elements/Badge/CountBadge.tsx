import type { CountBadgeProps } from "@/types/components/elements/badge";

const CountBadge = ({ count, className }: CountBadgeProps) => {
  const value = Number(count) || 0;
  if (!value) return null;

  return (
    <div
      className={`absolute -start-2.5 -top-1.5 z-1 aspect-square w-5 h-5 rounded-full border border-status-danger-line bg-status-danger-bg text-status-danger flex items-center justify-center text-[10px] ${className ?? ""}`}
    >
      {value}
    </div>
  );
};

export default CountBadge;
