import type { PulseDotProps } from "@/types/components/elements/badge";

const PulseDot = ({ className }: PulseDotProps) => (
  <div
    className={`w-2 h-2 rounded-full bg-red-600 animate-pulse transition-all ${className ?? ""}`}
  />
);

export default PulseDot;
