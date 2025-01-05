import { SinglePropDto } from "@/api_services/property/property.interface";
import React from "react";
import PrimaryAccard from "./PrimaryAccard";

const SinglePorpertyAccards = ({ data }: { data: SinglePropDto }) => {
  return (
    <div className="w-full flex flex-col">
      <PrimaryAccard data={data} />
    </div>
  );
};

export default SinglePorpertyAccards;
