import React from "react";
import LinearSkeleton from "./LinearSkeleton";

const SingleProductIntroSkeleton = () => {
  return (
    <div className="w-full gap-6 flex flex-col">
      <LinearSkeleton width={"50%"} />
      <LinearSkeleton width={"50%"} />
      <LinearSkeleton width={"100%"} />
      <LinearSkeleton width={"100%"} />
      <LinearSkeleton width={"100%"} />
      <LinearSkeleton width={"100%"} />
      <div className=" w-full flex items-center gap-4">
        <LinearSkeleton width={"50%"} />
        <LinearSkeleton width={"50%"} />
      </div>
    </div>
  );
};

export default SingleProductIntroSkeleton;
