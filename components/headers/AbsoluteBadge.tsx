import React from "react";

const AbsoluteBadge = ({ count }: { count: number }) => {
  return (
    <>
      {!!count ? (
        <div className=" absolute -right-2.5 aspect-square w-5 h-5 -top-1.5 rounded-full   text-white border border-primary-100 bg-primary-150 flex  z-1 items-center justify-center text-[10px]">
          {count}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default AbsoluteBadge;
