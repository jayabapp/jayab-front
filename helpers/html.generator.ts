import HTMLParser, { HTMLElement } from "node-html-parser";
import sanitizeHtml from "sanitize-html";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export type Heading = { id: string; innerText: string };

export type ReturnType = {
  html: string;
  headings: Heading[];
  wordCount?: number;
  timeToRead?: number;
  faqData?: { title: string; innerText: string }[];
};

type TransformOptions = {
  hasHeading?: boolean;
  hasCount?: boolean;
};

type TransformContext = {
  swiperIndex: number;
  headings: Heading[];
  faqData: { title: string; innerText: string }[];
  options?: TransformOptions;
};

type Transformer = (root: HTMLElement, context: TransformContext) => void;

/* -------------------------------------------------------------------------- */
/*                         STANDALONE <a> DETECTION                           */
/* -------------------------------------------------------------------------- */

const isStandaloneAnchor = (a: HTMLElement): boolean => {
  if (a.rawTagName !== "a") return false;

  const text = a.innerText?.trim();
  if (!text) return false;

  const parent = a.parentNode as HTMLElement;
  if (!parent || parent.nodeType !== 1) return false;

  const hasOtherContent = parent.childNodes.some((node) => {
    if (node === a) return false;
    if (node.nodeType === 3) return node.rawText.trim().length > 0;
    if (node.nodeType === 1) return true;
    return false;
  });

  if (hasOtherContent) return false;

  return ["p", "div", "li", "section"].includes(parent.rawTagName);
};

/* -------------------------------------------------------------------------- */
/*                          IMAGE HELPERS                                     */
/* -------------------------------------------------------------------------- */

interface ExtractedImage {
  src: string;
  alt: string;
  title: string;
  width?: string;
  height?: string;
}

const extractImagesFromNode = (node: HTMLElement): ExtractedImage[] => {
  const images: ExtractedImage[] = [];

  const imgElements = node.rawTagName === "img" ? [node] : node.querySelectorAll("img");

  imgElements.forEach((img) => {
    images.push({
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || "",
      title: img.getAttribute("title") || "",
      width: img.getAttribute("width") || "",
      height: img.getAttribute("height") || "",
    });
  });

  if (node.getAttribute("data-swiper") === "true") {
    try {
      const swiperImages = JSON.parse(decodeURIComponent(node.getAttribute("data-images") || "[]"));
      images.push(...swiperImages);
    } catch {}
  }

  return images;
};

const elementHasImages = (node: HTMLElement): boolean => {
  if (node.rawTagName === "img") return true;
  if (node.getAttribute("data-swiper") === "true") return true;
  return node.querySelectorAll("img").length > 0;
};

/* -------------------------------------------------------------------------- */
/*                             TRANSFORMERS                                   */
/* -------------------------------------------------------------------------- */

const replaceQuotes: Transformer = (root) => {
  root.querySelectorAll("#quote").forEach((node, index) => {
    const text = node.innerText?.trim() || "";
    node.replaceWith(
      HTMLParser.parse(`
        <div data-quote="true"
          data-text="${encodeURIComponent(text)}"
          data-index="${index}">
        </div>
      `),
    );
  });
  root.querySelectorAll("blockquote").forEach((node, index) => {
    const text = node.innerText?.trim() || "";
    node.replaceWith(
      HTMLParser.parse(`
        <div data-quote="true"
          data-text="${encodeURIComponent(text)}"
          data-index="${index}">
        </div>
      `),
    );
  });
};

const replaceTables: Transformer = (root) => {
  root.querySelectorAll("table").forEach((tableNode, index) => {
    const tableHTML = tableNode.toString();
    tableNode.replaceWith(
      HTMLParser.parse(`
        <div data-table="true"
          data-content="${encodeURIComponent(tableHTML)}"
          data-index="${index}">
        </div>
      `),
    );
  });
};

const handleFAQ: Transformer = (root, context) => {
  root.querySelectorAll("details").forEach((detailsNode, index) => {
    const summary = detailsNode.querySelector("summary");
    const title = summary?.text.trim() || "";
    const isOpen = detailsNode.getAttribute("open") ? "true" : "false";

    summary?.remove();

    const innerText = detailsNode.text.replace(/\s+/g, " ").trim();
    context.faqData.push({ title, innerText });

    detailsNode.replaceWith(
      HTMLParser.parse(`
        <div data-accordion="true"
          data-title="${encodeURIComponent(title)}"
          data-open="${isOpen}"
          data-index="${index}">
          ${detailsNode.innerHTML}
        </div>
      `),
    );
  });
};

const handleProducts: Transformer = (root) => {
  root.querySelectorAll("#products").forEach((p, index) => {
    const products = p
      .querySelectorAll("div")
      .map((product) => ({
        href: product.getAttribute("data-product-href") || "",
        title: product.getAttribute("data-product-title") || "",
        price: product.getAttribute("data-product-price") || "",
        id: product.getAttribute("data-product-id") || "",
        img: product.getAttribute("data-product-img") || "",
      }))
      .filter((i) => !!i.id);

    if (products.length <= 1) return;

    p.replaceWith(
      HTMLParser.parse(`
        <div data-product-swiper="true"
          data-products="${encodeURIComponent(JSON.stringify(products))}"
          data-count="${products.length}"
          data-index="${index}">
        </div>
      `),
    );
  });
};

const replaceStandaloneLinks: Transformer = (root) => {
  root.querySelectorAll("a").forEach((a) => {
    if (!isStandaloneAnchor(a)) return;

    const href = a.getAttribute("href") || "";
    const target = a.getAttribute("target") || "";
    const rel = a.getAttribute("rel") || "";
    const title = a.getAttribute("title") || "";
    const text = a.innerText.trim();

    a.parentNode?.replaceWith(
      HTMLParser.parse(`
        <div data-standalone-link="true"
          data-href="${encodeURIComponent(href)}"
          data-target="${encodeURIComponent(target)}"
          data-rel="${encodeURIComponent(rel)}"
          data-title="${encodeURIComponent(title)}"
          data-text="${encodeURIComponent(text)}">
        </div>
      `),
    );
  });
};

const groupSiblingImageElements: Transformer = (root, context) => {
  const processLevel = (parent: HTMLElement) => {
    const children = parent.childNodes.filter((n) => n.nodeType === 1) as HTMLElement[];

    let buffer: HTMLElement[] = [];

    const flushBuffer = () => {
      if (buffer.length <= 1) {
        buffer = [];
        return;
      }

      const allImages: ExtractedImage[] = [];

      buffer.forEach((el) => {
        allImages.push(...extractImagesFromNode(el));
      });

      // remove duplicate src
      const uniqueImages = allImages.filter((img, pos, self) => pos === self.findIndex((i) => i.src === img.src));

      if (uniqueImages.length <= 1) {
        buffer = [];
        return;
      }

      const swiperNode = HTMLParser.parse(`
        <div
          data-swiper="true"
          data-images="${encodeURIComponent(JSON.stringify(uniqueImages))}"
          data-count="${uniqueImages.length}"
          data-index="${context.swiperIndex++}"
          class="combined-swiper"
        ></div>
      `);

      buffer[0].replaceWith(swiperNode);

      for (let i = 1; i < buffer.length; i++) {
        buffer[i].remove();
      }

      buffer = [];
    };

    children.forEach((child) => {
      if (elementHasImages(child)) {
        buffer.push(child);
      } else {
        flushBuffer();
      }
    });

    flushBuffer();

    // recurse into children that still exist
    children.forEach((child) => {
      if (child.parentNode) processLevel(child);
    });
  };

  processLevel(root);
};

const enhanceHeadings: Transformer = (root, context) => {
  root.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach((h) => {
    h.classList.add("blog-padding");
  });

  if (!context.options?.hasHeading) return;

  root.querySelectorAll("h2").forEach((h, index) => {
    const id = `h2_${index}`;
    h.setAttribute("id", id);
    context.headings.push({ id, innerText: h.innerText });
  });
};

/* -------------------------------------------------------------------------- */
/*                               MAIN FUNCTION                                */
/* -------------------------------------------------------------------------- */

export const HTMLGenerator = (html: string, options?: TransformOptions): ReturnType => {
  const sanitized = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["iframe", "img", "details", "summary"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": [
        "class",
        "target",
        "rel",
        "allow",
        "allowfullscreen",
        "frameborder",
        "src",
        "alt",
        "width",
        "height",
        "title",
        "id",
        "data-product-id",
        "data-product-img",
        "data-product-title",
        "data-product-href",
        "data-product-price",
      ],
    },
  });

  const root = HTMLParser.parse(sanitized);

  const context: TransformContext = {
    swiperIndex: 0,
    headings: [],
    faqData: [],
    options,
  };

  const transformers: Transformer[] = [
    replaceQuotes,
    replaceTables,
    handleFAQ,
    handleProducts,
    replaceStandaloneLinks,
    groupSiblingImageElements,
    enhanceHeadings,
  ];

  transformers.forEach((t) => t(root, context));

  let COUNT = 0;
  let TTR = 0;

  if (options?.hasCount) {
    const text = root.innerText;
    COUNT = text.split(/\s+/).filter(Boolean).length;
    TTR = Math.ceil(COUNT / 190);
  }

  return {
    html: root.toString(),
    headings: context.headings,
    wordCount: options?.hasCount ? COUNT : undefined,
    timeToRead: options?.hasCount ? TTR : undefined,
    faqData: context.faqData,
  };
};

HTMLGenerator.Version = "1.5.0";
