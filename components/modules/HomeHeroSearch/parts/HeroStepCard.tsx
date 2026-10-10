import { ContentImage } from "@elements/Image";
import { motion } from "framer-motion";

import type { HeroStepCardProps } from "@/types/components/modules/home-hero-search";

const HeroStepCard = ({
  icon,
  title,
  onOpen,
  summary,
  isActive,
  children,
  hasBeenOpened,
}: HeroStepCardProps) => (
  <section
    className={`overflow-hidden rounded-20 border bg-white transition-colors ${
      isActive ? "border-brand-600 shadow-card" : "border-neutral-200"
    }`}
  >
    <button
      type="button"
      onClick={onOpen}
      aria-expanded={isActive}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-right"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50">
        <ContentImage alt="" src={icon} width={18} height={18} className="size-[1.125rem]" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5">
        <span className="text-2xs font-bold leading-tight text-neutral-500">{title}</span>
        <span
          className={`w-full truncate text-sm leading-snug ${
            summary ? "font-medium text-neutral-900" : "text-neutral-400"
          }`}
        >
          {summary || "—"}
        </span>
      </span>

      <motion.span
        className="shrink-0"
        animate={{ rotate: isActive ? 0 : 180 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <ContentImage
          alt=""
          width={14}
          height={14}
          className="size-3.5 opacity-50"
          src="/assets/icons/shared/caret-down.svg"
        />
      </motion.span>
    </button>

    <motion.div
      initial={false}
      className="overflow-hidden"
      transition={{ duration: 0.25, ease: "easeInOut" }}
      animate={isActive ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
    >
      {hasBeenOpened ? <div className="border-t pb-1">{children}</div> : <></>}
    </motion.div>
  </section>
);

export default HeroStepCard;
