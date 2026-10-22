export type BrandTitleProps = {
  /** white sits on photos and brand fills; blue adapts to the theme on surfaces. */
  tone: "blue" | "white";
  /** Forces the Persian or Latin wordmark regardless of the reader's locale. Omitted: follows locale. */
  script?: "fa" | "en";
  className?: string;
};
