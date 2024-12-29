import React from "react";

const StepShower = ({
  value,
  steps,
}: {
  value: string | number;
  steps: { title: string; description: string; id: number | string }[];
}) => {
  return (
    <div className="flex items-center w-full  relative justify-between">
      {/* <div className="w-full absolute  bg-gray-300 h-[5px]"></div> */}
      {steps?.map((e, index) => {
        const isSelected = e?.id <= value;
        return (
          <div className="flex relative  w-full flex-col items-center justify-center gap-2" key={`steps${e?.id}`}>
            <div className="w-full relative flex items-center justify-center">
              <div
                className={` ${index == 0 ? "opacity-0" : ""} flex ${
                  !!isSelected ? "text-primary-700" : ""
                }   bg-gray-300 h-[5px] w-full`}
              >
                {" "}
              </div>
              <div
                style={{ background: !!isSelected ? color : undefined }}
                className=" w-4 h-4 !shrink-0 aspect-square bg-gray-300 rounded-full"
              >
                {" "}
              </div>
              <div
                style={{ background: !!isSelected && e?.id < value ? color : undefined }}
                className={`  ${index == steps?.length - 1 ? "opacity-0" : ""}  flex  bg-gray-300 h-[5px] w-full`}
              >
                {" "}
              </div>
            </div>
            <div className="flex absolute flex-col top-6 items-center justify-center gap-2">
              <p className={` text-primary-700 text-center font-bold text-xs md:text-base`}>{e?.title}</p>
              <p className=" text-center  text-[9px] md:text-sm">{e?.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepShower;
