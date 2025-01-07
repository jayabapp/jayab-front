import React from "react";

const AbsoluteBadge = ({ count }: { count: number }) => {
  return (
    <>
      {!!count ? (
        <div className=" absolute -right-2 aspect-square w-4 h-4 -top-1.5 rounded-full   text-white border border-white bg-pink-500 flex  items-center justify-center text-[10px]">
          {count}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AbsoluteBadge;
