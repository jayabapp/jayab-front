import React from "react";

// import statusTick from "../../../public/assets/icons/status/status_tick.svg";
const StatusShower = ({ data, containerClass }: { data: any; containerClass?: string }) => {
  return (
    <div
      className={` ${containerClass}   w-fit flex items-center gap-2 px-3 py-2 rounded-xl text-xxs  md:text-sm font-medium`}
      style={{
        background: `${data?.hex}15`,
        // borderColor: `${data?.hex}`,
        color: `${data?.hex}`,
      }}
    >
      {/* <img className="w-5 h-5 aspect-square" src={statusTick?.src} /> */}
      {data?.title}
    </div>
  );
};

export default StatusShower;
