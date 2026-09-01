"use client";

import type { AccordionProps } from "@/types/components/elements/accordion";

import { ContentImage } from "@elements/Image";
import { motion } from "framer-motion";
import { useState } from "react";

const Accordion = ({ title = "Default Title", children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border rounded-2xl h-fit"
      style={{ boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.15)" }}
    >
      <button
        className="w-full flex justify-between items-center px-4 py-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 text-sm sm:text-base">
          <ContentImage
            alt=""
            width={24}
            height={24}
            src="/assets/icons/accordion/Frame.svg"
          />
          <div className="text-start">{title}</div>
        </div>
        <motion.img
          alt="Toggle"
          className="w-5 h-5 ml-2"
          animate={{ rotate: isOpen ? 0 : 180 }}
          src="/assets/icons/shared/caret-down.svg"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="flex items-start gap-4 px-6 py-3 text-neutral-600">
          <ContentImage
            alt=""
            width={24}
            height={24}
            className="pr-1"
            src="/assets/icons/accordion/Group.svg"
          />
          <div className="text-start">{children}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Accordion;
