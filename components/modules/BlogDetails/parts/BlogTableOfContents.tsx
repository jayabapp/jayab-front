import { useTranslations } from "next-intl";

import type { BlogTableOfContentsProps } from "@/types/components/modules/blog";

import isEmpty from "lodash/isEmpty";
import Link from "next/link";

const LIST_CLASS =
  "flex max-h-72 list-none flex-col overflow-y-auto border-r border-line pr-0";

const BlogTableOfContents = ({ headings }: BlogTableOfContentsProps) => {
  const t = useTranslations("content");
  if (isEmpty(headings)) return <></>;
  return (
    <nav aria-label={t("blogTableOfContents")} className="flex flex-col gap-3">
      <p className="text-sm font-bold">{t("blogTableOfContents")}</p>

      <ul className={LIST_CLASS}>
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <Link
              replace
              href={`#${heading.id}`}
              title={t("blogTableOfContents")}
              className="group -mr-px flex items-start gap-2 border-r-2 border-transparent py-2 pr-3 text-xs leading-6 transition-colors hover:border-action hover:text-link md:text-sm"
            >
              <span className="shrink-0 text-xxs text-ink-subtle transition-colors group-hover:text-link">
                {index + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: heading.innerText }} />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BlogTableOfContents;
