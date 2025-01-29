import React from "react";
import SingleProductIntroSkeleton from "./SingleProductIntroSkeleton";
import SingleProductImageSkeleton from "./SingleProductImageSkeleton";
import BlockSkeleton from "./BlockSkeleton";
import LinearSkeleton from "./LinearSkeleton";

const ProductSkeleton = () => {
  return (
    <div className=" col-span-full  pt-0 md:py-8 min-h-[30dvh] grid  gap-4  w-full grid-cols-1 md:grid-cols-2  ">
      {/* <LottieLoading margin="w-full" /> */}
      <SingleProductImageSkeleton />
      <SingleProductIntroSkeleton />
      <BlockSkeleton width={"100%"} />
      <div className="flex flex-col gap-4 w-full">
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
        <LinearSkeleton width={"100%"} />
      </div>
    </div>
  );
};

export default ProductSkeleton;
