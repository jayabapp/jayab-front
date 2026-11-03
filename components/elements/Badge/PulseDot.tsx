import type { PulseDotProps } from "@/types/components/elements/badge";

const PulseDot = ({ className }: PulseDotProps) => (
  <div
    className={`w-2 h-2 rounded-full bg-status-danger animate-pulse transition-all ${className ?? ""}`}
  />
);

export default PulseDot;
