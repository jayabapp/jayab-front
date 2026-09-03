import type { BlogTableOfContentsProps } from "@/types/components/modules/blog";

import _STRINGS from "@/utils/LocalStrings";
import isEmpty from "lodash/isEmpty";
import Link from "next/link";

// Long guides run past twenty headings. Left uncapped the list pushed everything
// below it — related posts included — off the first screen, so the rail scrolls
// inside itself instead of stretching the sidebar.
const LIST_CLASS =
  "flex max-h-72 list-none flex-col overflow-y-auto border-r border-neutral-200 pr-0";

const BlogTableOfContents = ({ headings }: BlogTableOfContentsProps) => {
  if (isEmpty(headings)) return <></>;

  return (
    <nav
      aria-label={_STRINGS.BLOG_TABLE_OF_CONTENTS}
      className="flex flex-col gap-3"
    >
      <p className="text-sm font-bold">{_STRINGS.BLOG_TABLE_OF_CONTENTS}</p>

      <ul className={LIST_CLASS}>
        {headings.map((heading, index) => (
          <li key={heading.id}>
            <Link
              replace
              href={`#${heading.id}`}
              title={_STRINGS.BLOG_TABLE_OF_CONTENTS}
              className="group -mr-px flex items-start gap-2 border-r-2 border-transparent py-2 pr-3 text-xs leading-6 transition-colors hover:border-brand-600 hover:text-brand-600 md:text-sm"
            >
              <span className="shrink-0 text-xxs text-neutral-400 transition-colors group-hover:text-brand-600">
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
