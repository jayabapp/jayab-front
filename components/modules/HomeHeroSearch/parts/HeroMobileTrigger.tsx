import type { HeroMobileTriggerProps } from "@/types/components/modules/home-hero-search";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";

/**
 * The collapsed search on phones: one pill instead of three cells on one row.
 *
 * The three-cell bar needs roughly 90px per cell on a 360px screen, and each
 * cell stacks a caption over a value — so every field truncated and the row read
 * as one crowded control rather than three answerable questions.
 *
 * It shows the staged answers rather than resetting to the empty prompt, because
 * after the sheet closes this pill is the only record of what was chosen; a
 * summary here is what lets someone re-open it to change one thing instead of
 * re-deriving all three.
 */
const HeroMobileTrigger = ({ onOpen, onPreload, summary }: HeroMobileTriggerProps) => (
  <button
    type="button"
    onClick={onOpen}
    onPointerDown={onPreload}
    data-test="hero-mobile-trigger"
    className="surface-panel flex w-full items-center gap-3 !rounded-full p-2 text-right shadow-glass"
  >
    {/* Text before the icon in source order, which in RTL puts the label against
        the right edge where reading starts and leaves the magnifier at the far
        left. Ordered in the markup rather than with `flex-row-reverse` so the
        DOM, the tab order and the rendered row all agree. */}
    <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 pr-2">
      <span className="w-full truncate text-sm font-bold leading-tight text-neutral-900">
        {summary.title || _STRINGS.HERO_STEP_WHERE}
      </span>
      <span className="w-full truncate text-xxs leading-tight text-neutral-500">
        {summary.detail || _STRINGS.HERO_MOBILE_TRIGGER_HINT}
      </span>
    </span>

    <span className="btn-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600">
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
