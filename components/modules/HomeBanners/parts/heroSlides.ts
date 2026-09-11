import type { HeroSlide } from "@/types/components/modules/home";

import _STRINGS from "@/utils/LocalStrings";

const HERO_DIR = "/assets/images/home/hero";

export const STATIC_HERO_SLIDES: HeroSlide[] = [
  {
    key: "static-meadow-cabin",
    alt: _STRINGS.HERO_SLIDE_MEADOW_ALT,
    desktopSrc: `${HERO_DIR}/meadow-cabin.webp`,
    mobileSrc: `${HERO_DIR}/meadow-cabin.webp`,
    focus: "50% 42%",
  },
  {
    key: "static-dusk-chalet",
    alt: _STRINGS.HERO_SLIDE_DUSK_ALT,
    desktopSrc: `${HERO_DIR}/dusk-chalet.webp`,
    mobileSrc: `${HERO_DIR}/dusk-chalet.webp`,
    focus: "50% 36%",
  },
  {
    key: "static-night-chalet",
    alt: _STRINGS.HERO_SLIDE_NIGHT_ALT,
    desktopSrc: `${HERO_DIR}/night-chalet.webp`,
    mobileSrc: `${HERO_DIR}/night-chalet.webp`,
    focus: "45% 38%",
  },
];
