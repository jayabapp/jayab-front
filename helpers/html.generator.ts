import DOMPurify from "isomorphic-dompurify";
import HTMLParser from "node-html-parser";
import { quoteGenerator } from "./quote.generator";
import { tableGenerator } from "./table.generator";
type ReturnType = {
  html: any;
  headings: any[];
  wordCount?: number;
  timeToRead?: number;
};
export const HTMLGenerator = (html: string, options?: { hasHeading?: boolean; hasCount?: boolean }): ReturnType => {
  const { hasHeading, hasCount } = options || {};
  let root = HTMLParser.parse(DOMPurify.sanitize(html));
  root.querySelectorAll("#quote").map((i) => i?.replaceWith(quoteGenerator(i?.innerText)));
  root.querySelectorAll("table").map((i) => {
    i?.replaceWith(tableGenerator(i));
  });
  let HEADINGS: any[] = [];
  root.querySelectorAll("h1,h2,h3,h4,h5,h6").map((i, index) => {
    i?.classList.add("blog-padding");
  });
  let COUNT = 0;
  let TTR = 0;
  if (hasCount) {
    root.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,strong,a,li").forEach((i) => {
      COUNT += i?.innerText?.split(" ")?.length;
    });
    TTR = Math.round(COUNT / 190);
  }
  if (hasHeading)
    HEADINGS = root.querySelectorAll("h2").map((i, index) => {
      return i?.setAttribute("id", `${i?.rawTagName}_${index}`);
    });

  return { html: root, headings: HEADINGS, wordCount: COUNT, timeToRead: TTR };
};
