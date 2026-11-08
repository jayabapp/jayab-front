import { isMobile } from "react-device-detect";

import type { StandaloneLinkCardProps } from "@/types/helpers/html";

import numberWithCommas from "./numberWithCommas";
import SimpleAccordion from "@elements/Accordion/SimpleAccordion.client";
import HTMLParser from "node-html-parser";
import DOMPurify from "isomorphic-dompurify";
import Swiper from "@elements/Carousel/Swiper.client";
import Button from "@elements/Button";
import Image from "next/image";
import Link from "next/link";

const sanitize = (html: string) =>
  DOMPurify.sanitize(html, {
    FORCE_BODY: true,
    SANITIZE_DOM: true,
  });

const decodeAttribute = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
};

const decodeArrayAttribute = (value: string): unknown[] => {
  try {
    const decoded = decodeURIComponent(value);
    const parsed: unknown = JSON.parse(decoded);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const isSafeLink = (href: unknown): href is string => {
  if (typeof href !== "string") return false;
  const value = href.trim();
  if (!value) return false;
  try {
    const url = new URL(value, "https://example.invalid");
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const isSafeImageSrc = (src: unknown): src is string => {
  if (typeof src !== "string") return false;
  const value = src.trim();
  if (!value) return false;
  try {
    const url = new URL(value, "https://example.invalid");
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const normalizeTarget = (
  target: string,
): "_self" | "_blank" | "_parent" | "_top" => {
  switch (target) {
    case "_blank":
      return "_blank";
    case "_parent":
      return "_parent";
    case "_top":
      return "_top";
    default:
      return "_self";
  }
};

const normalizeRel = (rel: string, target: string): string | undefined => {
  const allowedTokens = new Set([
    "noopener",
    "noreferrer",
    "nofollow",
    "ugc",
    "sponsored",
    "external",
  ]);
  const tokens = rel
    .split(/\s+/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token && allowedTokens.has(token));
  if (target === "_blank") {
    if (!tokens.includes("noopener")) tokens.push("noopener");
    if (!tokens.includes("noreferrer")) tokens.push("noreferrer");
  }
  return tokens.length ? Array.from(new Set(tokens)).join(" ") : undefined;
};

const normalizeDimension = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0)
    return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return undefined;
};

type DecodedImage = {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
};

type DecodedProduct = {
  id?: string | number;
  href: string;
  img: string;
  title?: string;
  price?: string | number;
};

const decodeImages = (value: string): DecodedImage[] =>
  decodeArrayAttribute(value).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const image = item as Record<string, unknown>;
    if (!isSafeImageSrc(image.src)) return [];
    return [
      {
        src: image.src.trim(),
        alt: typeof image.alt === "string" ? image.alt : "",
        title: typeof image.title === "string" ? image.title : "",
        width: normalizeDimension(image.width),
        height: normalizeDimension(image.height),
      },
    ];
  });

const decodeProducts = (value: string): DecodedProduct[] =>
  decodeArrayAttribute(value).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const product = item as Record<string, unknown>;
    if (!isSafeLink(product.href)) return [];
    if (!isSafeImageSrc(product.img)) return [];
    return [
      {
        id:
          typeof product.id === "string" || typeof product.id === "number"
            ? product.id
            : undefined,
        href: product.href.trim(),
        img: product.img.trim(),
        title: typeof product.title === "string" ? product.title : "",
        price:
          typeof product.price === "string" || typeof product.price === "number"
            ? product.price
            : "",
      },
    ];
  });

const StandaloneLinkCard = ({
  rel,
  href,
  text,
  title,
  target,
}: StandaloneLinkCardProps) => {
  const safeTarget = normalizeTarget(target || "");
  const safeRel = normalizeRel(rel || "", safeTarget);

  return (
    <Link
      href={href}
      rel={safeRel}
      target={safeTarget}
      className="link w-full"
      title={title || undefined}
    >
      <div className="flex w-full flex-row items-center justify-between rounded-10 bg-gray-100">
        <div className="flex w-full items-center justify-start gap-2 p-4">
          <div>{title || text}</div>
        </div>
      </div>
    </Link>
  );
};

export function convertHtmlToReact(htmlString: string, imageQuality = 75) {
  if (!htmlString) return [];

  // TEMPORARY memory diagnostic: DIAG_BYPASS_BLOG_DOMPURIFY=1 skips only this
  // full-document DOMPurify/JSDOM pass on the server, to A/B heap retention.
  // Never enable it in normal production. Remove after the experiment.
  const bypassDomPurify =
    typeof window === "undefined" &&
    process.env.DIAG_BYPASS_BLOG_DOMPURIFY === "1";
  const sanitizedHtml = bypassDomPurify ? htmlString : sanitize(htmlString);
  const root = HTMLParser.parse(sanitizedHtml);
  const children = root.childNodes;

  const renderNode = (node: any, index: number): any => {
    if (node.nodeType === 3) return node.rawText;
    if (node.getAttribute?.("data-accordion") === "true") {
      const title = decodeAttribute(node.getAttribute("data-title") || "");
      const isOpen = node.getAttribute("data-open") === "true";
      return (
        <SimpleAccordion
          key={index}
          title={title}
          isOpenFirst={isOpen}
          item={{
            parenClass: "bg-surface rounded-xl shadow-md my-2",
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: node.innerHTML,
            }}
          />
        </SimpleAccordion>
      );
    }

    if (node.getAttribute?.("data-quote") === "true") {
      const text = decodeAttribute(node.getAttribute("data-text") || "");
      return (
        <div
          key={index}
          className="w-full whitespace-pre-line relative text-white text-lg my-6 pt-8 overflow-visible text-center px-4 !bg-primary-500 flex items-center justify-center rounded-10"
        >
          <div className="absolute -top-4 shadow-md w-12 h-12 rounded-full flex items-end justify-center bg-[#eee]">
            <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
              <rect y="-18" width="50" height="50" rx="25" fill="#eee" />

              <path
                d="M16.875 15.25C15.8594 15.25 15 14.3906 15 13.375V4C15 0.523438 17.8125 -2.25 21.25 -2.25H21.5625C22.1094 -2.25 22.5 -1.85938 22.5 -1.3125V0.5625C22.5 1.07031 22.1094 1.5 21.5625 1.5H21.25C19.8828 1.5 18.75 2.59375 18.75 4V6.5H21.875C22.9297 6.5 23.75 7.32031 23.75 8.375V13.375C23.75 14.3906 22.9297 15.25 21.875 15.25H16.875ZM28.125 15.25C27.1094 15.25 26.25 14.3906 26.25 13.375V4C26.25 0.523438 29.0625 -2.25 32.5 -2.25H32.8125C33.3594 -2.25 33.75 -1.85938 33.75 -1.3125V0.5625C33.75 1.07031 32.1094 1.5 32.8125 1.5H32.5C31.1328 1.5 30 2.59375 30 4V6.5H33.125C34.1797 6.5 35 7.32031 35 8.375V13.375C35 14.3906 34.1797 15.25 33.125 15.25H28.125Z"
                fill="#EA3934"
              />
            </svg>
          </div>

          {text}
        </div>
      );
    }

    if (node.getAttribute?.("data-standalone-link") === "true") {
      const href = decodeAttribute(node.getAttribute("data-href") || "");
      const text = decodeAttribute(node.getAttribute("data-text") || "");
      const target = decodeAttribute(node.getAttribute("data-target") || "");
      const rel = decodeAttribute(node.getAttribute("data-rel") || "");
      const title = decodeAttribute(node.getAttribute("data-title") || "");
      if (!isSafeLink(href)) return title || text || null;
      return (
        <StandaloneLinkCard
          key={index}
          text={text}
          title={title}
          href={href.trim()}
          target={normalizeTarget(target)}
          rel={normalizeRel(rel, normalizeTarget(target))}
        />
      );
    }

    if (node.getAttribute?.("data-swiper") === "true") {
      const images = decodeImages(node.getAttribute("data-images") || "[]");
      if (!images.length) return null;
      return (
        <Swiper
          key={index}
          spaceBetween={12}
          slidesPerView={isMobile ? 1.25 : 2.1}
          viewportClassName="my-4 !select-none"
          breakPoints={{
            320: {
              slidesPerView: 1.25,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 1.25,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 1.25,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 2.1,
              spaceBetween: 15,
            },
            1600: {
              slidesPerView: 2.75,
              spaceBetween: 15,
            },
          }}
          pagination
          withArrows
          autoplay
          parentClass="my-6"
        >
          {images.map((img, idx) => {
            const hasDimensions =
              typeof img.width === "number" && typeof img.height === "number";

            return (
              <div
                key={`${img.src}-${idx}`}
                className="embla__slide flex items-center justify-center relative"
              >
                <Image
                  src={img.src}
                  loading="lazy"
                  alt={img.alt || ""}
                  fill={!hasDimensions}
                  quality={imageQuality}
                  title={img.title || ""}
                  width={hasDimensions ? img.width : undefined}
                  height={hasDimensions ? img.height : undefined}
                  className="rounded-xl object-contain max-h-[480px] w-full"
                  sizes="(min-width: 1600px) 20vw, (min-width: 1024px) 30vw, (min-width: 768px) 48vw, 74vw"
                />
              </div>
            );
          })}
        </Swiper>
      );
    }

    if (node.getAttribute?.("data-table") === "true") {
      const content = decodeAttribute(node.getAttribute("data-content") || "");
      const safeContent = sanitize(content);
      return (
        <div key={index} className="w-full my-4">
          <div className="w-full overflow-x-auto md:overflow-x-scroll">
            <div className="flex items-center justify-center rounded-xl overflow-hidden min-w-full md:min-w-fit">
              <div className="min-w-[100%] md:min-w-0 overflow-x-scroll">
                <div
                  className="w-full category_table"
                  dangerouslySetInnerHTML={{
                    __html: safeContent,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (node.getAttribute?.("data-product-swiper") === "true") {
      const products = decodeProducts(
        node.getAttribute("data-products") || "[]",
      );

      if (!products.length) return null;

      return (
        <Swiper
          key={`PRODUCTS${index}`}
          slidesPerView={isMobile ? 1.75 : 4.25}
          viewportClassName="my-1 !select-none"
          spaceBetween={5}
          breakPoints={{
            320: {
              slidesPerView: 1.75,
              spaceBetween: 5,
            },
            640: {
              slidesPerView: 1.75,
              spaceBetween: 5,
            },
            768: {
              slidesPerView: 1.75,
              spaceBetween: 5,
            },
            1024: {
              slidesPerView: 4.25,
              spaceBetween: 10,
            },
            1600: {
              slidesPerView: 5.5,
              spaceBetween: 15,
            },
          }}
          pagination
          withArrows
          autoplay
          parentClass="my-6"
        >
          {products.map((product, idx) => (
            <Link
              title={product.title || undefined}
              href={product.href}
              key={product.id ?? `${product.href}-${idx}`}
              className="embla__slide !no-underline p-2 bg-surface shadow-sm md:shadow-md rounded-xl gap-1 flex items-center flex-col justify-center relative"
            >
              <Image
                fill
                quality={75}
                loading="lazy"
                src={product.img}
                alt={product.title || ""}
                title={product.title || undefined}
                className="rounded-lg object-cover !aspect-square w-full"
                sizes="(min-width: 1600px) 10vw, (min-width: 1024px) 15vw, (min-width: 768px) 34vw, 50vw"
              />

              <h3 className="!no-underline !font-bold !text-ink text-right">
                {product.title}
              </h3>

              <p className="!no-underline text-sm !text-ink text-right">
                {numberWithCommas(product.price)} تومان
              </p>

              <Button title="مشاهده" variant="solid" containerClass="w-full" />
            </Link>
          ))}
        </Swiper>
      );
    }

    return (
      <div
        key={index}
        dangerouslySetInnerHTML={{
          __html: node.outerHTML,
        }}
      />
    );
  };

  return children.map((node, idx) => renderNode(node, idx));
}

convertHtmlToReact.Version = "1.4.0";
