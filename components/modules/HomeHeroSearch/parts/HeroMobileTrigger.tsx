import type { HeroMobileTriggerProps } from "@/types/components/modules/home-hero-search";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

const HeroMobileTrigger = ({
  onOpen,
  onPreload,
  summary,
  variant = "hero",
}: HeroMobileTriggerProps) => (
  <button
    type="button"
    onClick={onOpen}
    onPointerDown={onPreload}
    data-test="hero-mobile-trigger"
    className={`surface-panel flex w-full items-center !rounded-full text-right ${
      variant === "header"
        ? "h-10 min-w-0 gap-1.5 border-white/70 bg-white/90 p-1 shadow-glass-sm"
        : "gap-3 p-2 shadow-glass"
    }`}
  >
    <span
      className={`flex min-w-0 flex-1 flex-col items-start ${
        variant === "header" ? "pr-1.5" : "gap-0.5 pr-2"
      }`}
    >
      <span className="w-full truncate text-sm font-bold leading-tight text-neutral-900">
        {summary.title ||
          (variant === "header" ? _STRINGS.SEARCH : _STRINGS.HERO_STEP_WHERE)}
      </span>
      {variant === "hero" ? (
        <span className="w-full truncate text-xxs leading-tight text-neutral-500">
          {summary.detail || _STRINGS.HERO_MOBILE_TRIGGER_HINT}
        </span>
      ) : null}
    </span>

    <span
      className={`btn-primary flex shrink-0 items-center justify-center rounded-full bg-brand-600 ${
        variant === "header" ? "size-8" : "size-10"
      }`}
    >
      <ContentImage
        alt=""
        width={18}
        height={18}
        src="/assets/icons/edit/magnifier.svg"
        className="size-[1.125rem] shrink-0 brightness-0 invert"
      />
    </span>
  </button>
);

export default HeroMobileTrigger;
