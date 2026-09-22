/**
 * How many tiles a landing row fits across on desktop.
 *
 * The property-type and quick-search rows must end flush with the header and
 * the property grid, so their tile is a share of the row and the divisor is
 * the number of items the CMS actually returned — not a per-breakpoint guess.
 * A guess is flush at one item count and ragged at every other. The
 * popular-city row reuses the same number so its tiles come out the same size,
 * and simply scrolls whatever is past the first `count`.
 *
 * Clamped because the number is content-managed: the floor stops three items
 * from becoming 500px slabs, and the ceiling stops a long list from shrinking
 * the tile below its 64px icon plus a legible label.
 */
export const HOME_TILE_COUNT_MIN = 5;
export const HOME_TILE_COUNT_MAX = 12;
export const HOME_TILE_COUNT_FALLBACK = 8;

export const resolveHomeTileCount = (...counts: (number | undefined)[]) => {
  const first = counts.find((count) => !!count && count > 0);
  return Math.min(
    HOME_TILE_COUNT_MAX,
    Math.max(HOME_TILE_COUNT_MIN, first ?? HOME_TILE_COUNT_FALLBACK),
  );
};

/**
 * Embla's JS sizing for the property-type and quick-search rows.
 *
 * The 1024 and 1600 entries do not decide the desktop layout — `.home-tile-row`
 * in `styles/globals.css` overrides both `--slide-size` and `--slide-spacing`
 * from `lg` up, using the item-count divisor above. They are kept because
 * `CarouselProps["breakPoints"]` requires every `CarouselMediaSize` key, and
 * they are pinned to the same fallback and gap the stylesheet defaults to so
 * the two never state different things.
 */
export const HOME_TILE_BREAKPOINTS = {
  320: { slidesPerView: 4.5, spaceBetween: 5 },
  640: { slidesPerView: 4.5, spaceBetween: 5 },
  768: { slidesPerView: 5, spaceBetween: 10 },
  1024: { slidesPerView: HOME_TILE_COUNT_FALLBACK, spaceBetween: 12 },
  1600: { slidesPerView: HOME_TILE_COUNT_FALLBACK, spaceBetween: 12 },
};

export const HOME_TILE_DEFAULT_SLIDES_PER_VIEW = {
  compact: 4.5,
  wide: HOME_TILE_COUNT_FALLBACK,
};

export const HOME_TILE_DEFAULT_SPACE_BETWEEN = {
  compact: 5,
  wide: 12,
};
