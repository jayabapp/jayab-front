import { ReactNode } from "react";

export type CmsTextWhitespace = "pre-wrap" | "pre-line" | "normal";

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
}: {
  children: ReactNode;
  as?: "p" | "div" | "span";
  className?: string;
  whitespace?: CmsTextWhitespace;
}) => {
  const content = typeof children === "string" ? children.trim() : children;
  return (
    <Tag className={`${WHITESPACE_CLASS[whitespace]} ${className}`.trim()}>
      {content}
    </Tag>
  );
};

export default CmsText;
