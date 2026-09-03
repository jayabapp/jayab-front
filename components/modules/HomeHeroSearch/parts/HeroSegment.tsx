import type { HeroSegmentProps } from "@/types/components/modules/home-hero-search";

/**
 * One cell of the hero search bar: a small persistent label above the value.
 *
 * The label stays visible whether or not the field is filled. Placeholder-only
 * fields lose their name the moment they are answered, which is exactly when a
 * visitor scanning back across the bar needs to know which cell held what.
 */
const HeroSegment = ({
  filled,
  label,
  onClick,
  value,
  widthClass = "flex-1",
}: HeroSegmentProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`hero-field ${widthClass}`}
  >
    <span className="hero-field-label">{label}</span>
    <span
      className={`hero-field-value ${
        filled ? "font-medium text-neutral-900" : "text-neutral-400"
      }`}
    >
      {value}
    </span>
  </button>
);

export default HeroSegment;
