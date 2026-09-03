export type EmptyStateProps = {
  title?: string;
  description?: string;
  /**
   * Renders a CTA under the message. `actionLabel` plus one of `actionRoute`
   * (navigates) or `onAction` (stays put) — a dead end with no way out is worse
   * than no empty state at all.
   */
  actionLabel?: string;
  actionRoute?: string;
  onAction?: () => void;
};
