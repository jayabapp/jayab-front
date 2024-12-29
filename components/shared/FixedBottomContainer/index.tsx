import React from "react";

const FixedBottomContainer = ({ children }: { children: any }) => {
  return (
    <div
      className={`z-1  flex   max-w-[800px]  pb-8  pt-3 md:py-3   justify-between  md:rounded-md  left-0  right-0     mx-auto   shadow-card transition-all duration-1000	ease-in-out  items-center fixed bottom-0 w-full   bg-white    dark:border-t `}
    >
      {children}
    </div>
  );
};

export default FixedBottomContainer;
