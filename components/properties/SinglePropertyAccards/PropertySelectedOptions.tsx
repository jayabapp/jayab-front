import React from "react";

const PropertySelectedOptions = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-1.5 ">
      <div className="w-4 rounded-full bg-primary-700 h-4 flex items-center justify-center">
        <img className=" w-2 h-2" src="/assets/icons/adds/bright_tick.svg" />
      </div>
      <p> {title}</p>
    </div>
  );
};

export default PropertySelectedOptions;
