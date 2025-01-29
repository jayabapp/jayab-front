import React from "react";
import BlockSkeleton from "./BlockSkeleton";

const SingleProductImageSkeleton = () => {
  return (
    <div className="w-full gap-2 flex flex-row">
      <div className=" h-full  hidden md:flex w-0 md:w-[17%]  flex-col gap-2 justify-between ">
        <BlockSkeleton width={"100%"} />
        <BlockSkeleton width={"100%"} />
        <BlockSkeleton width={"100%"} />
        <BlockSkeleton width={"100%"} />
      </div>
      <div className=" w-full md:w-4/5">
        <BlockSkeleton width={"100%"} />
      </div>
    </div>
  );
};

export default SingleProductImageSkeleton;
