import React from "react";

const LinearSkeleton = ({ width }: { width: number | string }) => {
  return (
    <div
      style={{ backgroundColor: "#e5e7eb", width: width }}
      className="flex  h-8  rounded-full animate-pulse  items-center p-2 w-full group  transition-all duration-200 "
    ></div>
  );
};

export default LinearSkeleton;
