import React from "react";
import HomePropertiesSsrPart from "./HomePropertiesSsrPart";

const HomePropertiesList = ({ data }: { data: any[] }) => {
  return (
    <div className="w-full">
      <HomePropertiesSsrPart data={data} />
    </div>
  );
};

export default HomePropertiesList;
