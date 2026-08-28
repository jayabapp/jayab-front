"use client";
import { ReactNode, useState } from "react";
import { motion } from "framer-motion";

interface AccordionProps {
  title?: string;
  children: ReactNode;
}

function Accordion({ title = "Default Title", children }: AccordionProps) {
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
          <img src="/assets/icons/accordion/Frame.svg" alt="" />
          <div className="text-start">{title}</div>
        </div>
        <motion.img
          src="/assets/icons/shared/caret-down.svg"
          alt="Toggle"
          className="w-5 h-5 ml-2"
          animate={{ rotate: isOpen ? 0 : 180 }}
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
          <img
            src="/assets/icons/accordion/Group.svg"
            alt=""
            className="pr-1"
          />
          <div className="text-start">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}

export default Accordion;
