import React from "react";

const ProgressBar = ({
  step,
  divs,
}: {
  step: number | string;
  divs: {
    value: any;
    id: any;
    color: string;
    width: number;
  }[];
}) => {
  return (
    <div className="flex transition-all duration-200 ease-in-out items-center justify-between w-full gap-2">
      <div
        style={{ backgroundColor: "#BEBEBE50" }}
        className={`w-full rounded-full h-1 relative transition-all duration-[1500ms] ease-in-out `}
      >
        <div
          style={{
            backgroundColor: divs?.find((e) => e?.value == step)?.color,
            width: `${divs?.find((e) => e?.value == step)?.width}%`,
          }}
          className={`absolute rounded-full left-0 h-1 transition-all duration-[1500ms] ease-in-out `}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
