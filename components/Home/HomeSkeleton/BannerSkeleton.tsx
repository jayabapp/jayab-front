import React from "react";

const HomeSkeleton = () => {
  return (
    <div
      style={{ backgroundColor: "#e5e7eb" }}
      className="flex aspect-[2] md:aspect-[2.5] w-full md:w-[40%]  rounded-20 animate-pulse  items-center  group  transition-all duration-200 "
    ></div>
  );
};

export default HomeSkeleton;
