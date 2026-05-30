import Swiper from "@/components/embelaCarousel/Swiper";
import SimpleAccordion from "@/components/shared/SimpleAccorion";

import Button from "@/components/shared/Button/Button";
import Image from "next/image";
import Link from "next/link";
import HTMLParser from "node-html-parser";
import { isMobile } from "react-device-detect";
import numberWithCommas from "./numberWithCommas";

/* -------------------------------------------------------------------------- */
/*                         STANDALONE LINK CARD                                */
/* -------------------------------------------------------------------------- */

const StandaloneLinkCard = ({
  href,
  text,
  target,
  rel,
  title,
}: {
  href: string;
  text: string;
  target?: string;
  rel?: string;
  title?: string;
}) => {
  return (
    <Link
      className="link w-full"
      href={href}
      target={target || "_self"}
      rel={rel || undefined}
      title={title || undefined}
    >
      <div className="flex flex-row items-center justify-between w-full rounded-10 bg-gray-100">
        <div className="flex w-full items-center justify-start gap-2 p-4">
          {/* <LinkSimpleIcon className="size-6 text-secondary-500" weight="bold" /> */}
          <div>{title || text}</div>
        </div>
        {/* <CaretLeftIcon className="size-6 ml-4 text-secondary-500" /> */}
      </div>
    </Link>
  );
};

/* -------------------------------------------------------------------------- */
/*                       HTML → REACT CONVERTER                                */
/* -------------------------------------------------------------------------- */

export function convertHtmlToReact(htmlString: string) {
  const root = HTMLParser.parse(htmlString);
  const children = root.childNodes;

  const renderNode = (node: any, index: number): any => {
    /* ---------------------------- TEXT NODE ------------------------------- */
    if (node.nodeType === 3) {
      return node.rawText;
    }

    /* ---------------------------- ACCORDION ------------------------------- */
    if (node.getAttribute?.("data-accordion") === "true") {
      const title = decodeURIComponent(node.getAttribute("data-title") || "");
      const isOpen = node.getAttribute("data-open") === "true";

      return (
        <SimpleAccordion
          key={index}
          // passedId={`FAQ${index}`}
          title={title}
          isOpenFirst={isOpen}
          // titleIcon={<img className="w-7 h-7" alt="q_mark" src="/assets/icons/shared/q_mark.svg" />}
          item={{
            // noBorder: true,
            parenClass: "bg-white rounded-xl shadow-md my-2",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: node.innerHTML }} />
        </SimpleAccordion>
      );
    }
    /* ------------------------------ QUOTE -------------------------------- */
    if (node.getAttribute?.("data-quote") === "true") {
      const text = decodeURIComponent(node.getAttribute("data-text") || "");

      return (
        <div
          key={index}
          className="w-full whitespace-pre-line relative text-white text-lg my-6 pt-8 overflow-visible text-center px-4 !bg-primary-500 flex items-center justify-center rounded-10 "
        >
          <div className="absolute -top-4 shadow-md w-12 h-12 rounded-full flex items-end justify-center bg-[#eee]">
            <svg width="50" height="32" viewBox="0 0 50 32" fill="none">
              <rect y="-18" width="50" height="50" rx="25" fill="#eee" />
              <path
                d="M16.875 15.25C15.8594 15.25 15 14.3906 15 13.375V4C15 0.523438 17.8125 -2.25 21.25 -2.25H21.5625C22.1094 -2.25 22.5 -1.85938 22.5 -1.3125V0.5625C22.5 1.07031 22.1094 1.5 21.5625 1.5H21.25C19.8828 1.5 18.75 2.59375 18.75 4V6.5H21.875C22.9297 6.5 23.75 7.32031 23.75 8.375V13.375C23.75 14.3906 22.9297 15.25 21.875 15.25H16.875ZM28.125 15.25C27.1094 15.25 26.25 14.3906 26.25 13.375V4C26.25 0.523438 29.0625 -2.25 32.5 -2.25H32.8125C33.3594 -2.25 33.75 -1.85938 33.75 -1.3125V0.5625C33.75 1.07031 33.3594 1.5 32.8125 1.5H32.5C31.1328 1.5 30 2.59375 30 4V6.5H33.125C34.1797 6.5 35 7.32031 35 8.375V13.375C35 14.3906 34.1797 15.25 33.125 15.25H28.125Z"
                fill="#EA3934"
              />
            </svg>
          </div>
          {text}
        </div>
      );
    }
    /* ------------------------ STANDALONE LINK ----------------------------- */
    if (node.getAttribute?.("data-standalone-link") === "true") {
      const href = decodeURIComponent(node.getAttribute("data-href") || "");
      const text = decodeURIComponent(node.getAttribute("data-text") || "");
      const target = decodeURIComponent(node.getAttribute("data-target") || "");
      const rel = decodeURIComponent(node.getAttribute("data-rel") || "");
      const title = decodeURIComponent(node.getAttribute("data-title") || "");

      return <StandaloneLinkCard key={index} href={href} text={text} target={target} rel={rel} title={title} />;
    }
    /* ------------------------------ SWIPER -------------------------------- */
    if (node.getAttribute?.("data-swiper") === "true") {
      const images = JSON.parse(decodeURIComponent(node.getAttribute("data-images") || "[]"));

      if (!images.length) return null;

      return (
        <Swiper
          key={index}
          slidesPerView={isMobile ? 1.25 : 2.1}
          viewportClassName="my-4 !select-none"
          spaceBetween={12}
          breakPoints={{
            320: {
              slidesPerView: 1.25,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 1.25,
              spaceBetween: 15,
            },
            // when window width is >= 768px
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
          {images.map((img: any, idx: number) => (
            <div key={idx} className="embla__slide flex items-center justify-center relative">
              <Image
                src={img.src}
                fill={!img.width && !img?.height}
                quality={75}
                alt={img.alt || ""}
                title={img.title || ""}
                width={img.width || undefined}
                height={img.height || undefined}
                className="rounded-xl object-contain max-h-[480px] w-full"
                loading="lazy"
              />
            </div>
          ))}
        </Swiper>
      );
    }

    /* ------------------------------ TABLE -------------------------------- */
    if (node.getAttribute?.("data-table") === "true") {
      const content = decodeURIComponent(node.getAttribute("data-content") || "");

      return (
        <div key={index} className="w-full my-4">
          <div className="w-full overflow-x-auto md:overflow-x-visible">
            <div className="border border-primary-500 rounded-xl overflow-hidden min-w-full md:min-w-fit">
              <div className="min-w-[600px] md:min-w-0">
                <div className="w-full" dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    /* ------------------------------ PRODUCTS -------------------------------- */
    if (node.getAttribute?.("data-product-swiper") === "true") {
      const products = JSON.parse(decodeURIComponent(node.getAttribute("data-products") || "[]"));
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
            // when window width is >= 768px
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
          {products.map((product: any, idx: number) => (
            <Link
              href={product.href || ""}
              key={idx}
              className="embla__slide !no-underline p-2 bg-white  shadow-sm md:shadow-md rounded-xl gap-1 flex items-center flex-col justify-center relative"
            >
              <Image
                src={product.img}
                fill
                quality={75}
                alt={product?.title}
                title={product?.title}
                className="rounded-lg object-cover !aspect-square w-full"
                loading="lazy"
              />
              <h3 className="!no-underline !font-bold !text-black text-right">{product.title}</h3>
              <p className="!no-underline text-sm !text-black text-right ">{numberWithCommas(product.price)} تومان</p>
              <Button title={"مشاهده"} variant="solid" containerClass="w-full" />
            </Link>
          ))}
        </Swiper>
      );
    }

    /* ------------------------ DEFAULT FALLBACK ----------------------------- */
    return <div key={index} dangerouslySetInnerHTML={{ __html: node.outerHTML }} />;
  };

  return children.map((node, idx) => renderNode(node, idx));
}

/* -------------------------------------------------------------------------- */
/*                                  VERSION                                   */
/* -------------------------------------------------------------------------- */

convertHtmlToReact.Version = "1.3.0";
