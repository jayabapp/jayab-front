import type { CmsTextProps, CmsTextWhitespace } from "@/types/components/elements/cms";

const WHITESPACE_CLASS: Record<CmsTextWhitespace, string> = {
  "pre-wrap": "whitespace-pre-wrap",
  "pre-line": "whitespace-pre-line",
  normal: "",
};

const CmsText = ({
  children,
  as: Tag = "p",
  className = "",
  whitespace = "pre-wrap",
}: CmsTextProps) => {
  const content = typeof children === "string" ? children.trim() : children;
  return (
    <Tag className={`${WHITESPACE_CLASS[whitespace]} ${className}`.trim()}>
      {content}
    </Tag>
  );
};

export default CmsText;
