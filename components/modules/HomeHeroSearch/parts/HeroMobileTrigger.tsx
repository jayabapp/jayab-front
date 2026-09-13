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
        ? "h-10 min-w-0 gap-1.5 !border-neutral-200 bg-white p-1 !shadow-none"
        : "gap-2 !border-neutral-200/80 p-1 !shadow-[0_10px_28px_-10px_rgb(15_23_42/0.28),0_2px_6px_-1px_rgb(15_23_42/0.08)]"
    }`}
  >
    <span
      className={`flex min-w-0 flex-1 flex-col items-start ${
        variant === "header" ? "pr-1.5" : "gap-0.5 pr-2"
      }`}
    >
      <span
        className={`w-full truncate text-sm leading-tight ${
          summary.title
            ? "font-medium text-neutral-900"
            : "font-normal text-neutral-500"
        }`}
      >
        {summary.title || _STRINGS.HERO_STEP_WHERE}
      </span>
      {variant === "hero" && summary.detail ? (
        <span className="w-full truncate text-xxs leading-tight text-neutral-500">
          {summary.detail}
        </span>
      ) : null}
    </span>

    <span className="btn-primary flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-600">
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
