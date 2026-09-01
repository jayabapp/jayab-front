"use client";

import type { TStepShowerProps } from "@/types/components/elements/LinearData";
import { useRouter, useSearchParams } from "next/navigation";

const StepShower = ({ value, steps }: TStepShowerProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const edit_mode = searchParams.get("edit_mode");

  const onClick = (step: {
    title: string;
    description?: string;
    id: number | string;
    link?: string;
  }) => {
    if (!!edit_mode && !!step?.link) router.replace(step?.link);
  };

  return (
    <div className="flex items-center w-full    relative justify-between">
      {steps?.map((e, index) => {
        const isSelected = e?.id <= value;
        return (
          <div
            className="flex relative  w-full flex-col items-center justify-center gap-2"
            key={`steps${e?.id}`}
          >
            <div className="w-full relative flex items-center justify-center">
              <div
                className={` ${index == 0 ? "opacity-0" : ""} flex ${
                  !!isSelected ? "bg-brand-600" : ""
                }   bg-neutral-300 h-[5px] w-full`}
              >
                {" "}
              </div>
              <div
                onClick={() => onClick(e)}
                className={`${
                  !!isSelected ? "bg-brand-600" : "bg-neutral-300"
                }  w-4 h-4 !shrink-0 aspect-square  rounded-full`}
              >
                {" "}
              </div>
              <div
                className={` ${!!isSelected && e?.id < value ? "bg-brand-600 " : "bg-neutral-300 "} ${
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
                  !!isSelected ? "text-brand-600" : "  text-neutral-300 "
                }   text-center  text-xxs md:text-xs truncate`}
              >
                {e?.title}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepShower;
