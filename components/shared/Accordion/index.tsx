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
        className="w-full flex justify-between items-center px-4 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <img src="/assets/icons/accordion/Frame.svg" alt="" />
          {title}
        </div>
        <motion.img
          src="/assets/icons/shared/caret-down.svg"
          alt="Toggle"
          className="w-5 h-5 ml-2"
          animate={{ rotate: isOpen ? 180 : 0 }}
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
        <div className="flex items-start gap-4 px-6 py-3 text-[#5F636D]">
          <img src="/assets/icons/accordion/Group.svg" alt="" className="pr-1" />
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export default Accordion;
