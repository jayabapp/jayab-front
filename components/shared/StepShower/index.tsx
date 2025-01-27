"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const StepShower = ({
  value,
  steps,
}: {
  value: string | number;
  steps: { title: string; description?: string; id: number | string; link?: string }[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const edit_mode = searchParams.get("edit_mode");

  const onClick = (step: { title: string; description?: string; id: number | string; link?: string }) => {
    if (!!edit_mode && !!step?.link) {
      router.replace(step?.link);
    }
  };

  return (
    <div className="flex items-center w-full    relative justify-between">
      {/* <div className="w-full absolute  bg-gray-300 h-[5px]"></div> */}
      {steps?.map((e, index) => {
        const isSelected = e?.id <= value;
        return (
          <div className="flex relative  w-full flex-col items-center justify-center gap-2" key={`steps${e?.id}`}>
            <div className="w-full relative flex items-center justify-center">
              <div
                className={` ${index == 0 ? "opacity-0" : ""} flex ${
                  !!isSelected ? "bg-primary-700" : ""
                }   bg-gray-300 h-[5px] w-full`}
              >
                {" "}
              </div>
              <div
                onClick={() => onClick(e)}
                className={`${
                  !!isSelected ? "bg-primary-700" : "bg-gray-300"
                }  w-4 h-4 !shrink-0 aspect-square  rounded-full`}
              >
                {" "}
              </div>
              <div
                className={` ${!!isSelected && e?.id < value ? "bg-primary-700 " : "bg-gray-300 "} ${
                  index == steps?.length - 1 ? "opacity-0" : ""
                }  flex  h-[5px] w-full`}
              >
                {" "}
              </div>
            </div>
            <div
              className={`flex absolute flex-col ${
                (index + 1) % 2 == 0 ? "top-6" : " bottom-6"
              } items-center justify-center gap-2`}
            >
              <p
                className={`${
                  !!isSelected ? "text-primary-700" : "  text-gray-300 "
                }   text-center  text-xxs md:text-xs truncate`}
              >
                {e?.title}
              </p>
              {/* <p className=" text-center  text-[9px] md:text-sm">{e?.description}</p> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepShower;
