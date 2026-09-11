import type { HeroSegmentProps } from "@/types/components/modules/home-hero-search";

const HeroSegment = ({
  value,
  label,
  filled,
  onClick,
  widthClass = "flex-1",
}: HeroSegmentProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`hero-field ${widthClass}`}
  >
    <span className="hero-field-label">{label}</span>
    {value ? (
      <span
        className={`hero-field-value ${
          filled ? "font-medium text-neutral-900" : "text-neutral-400"
        }`}
      >
        {value}
      </span>
    ) : null}
  </button>
);

export default HeroSegment;
