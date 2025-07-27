import { SinglePropDto } from "@/api_services/property/property.interface";
import React from "react";
import PrimaryAccard from "./PrimaryAccard";
import GuestAccard from "./GuestAccard";
import EnvAccard from "./EnvAccard";
import RoomAccard from "./RoomAccard";
import FeatAccard from "./FeatAccard";
import GeneralFeatAccard from "./GeneralFeatAccard";
import MapPopupPart from "./MapPopupPart";
import RulesPopPart from "./RulesPopPart";
import ReportRoom from "./ReportRoom";

const SinglePorpertyAccards = ({ data }: { data: SinglePropDto }) => {
  return (
    <div className="w-full order-4 md:order-3 flex gap-2 flex-col">
      <PrimaryAccard data={data} />
      <GuestAccard data={data} />
      <EnvAccard data={data} />
      <RoomAccard data={data} />
      <FeatAccard data={data} />
      <GeneralFeatAccard data={data} />
      {!!data?.latitude ? <MapPopupPart data={data} /> : <></>}
      <RulesPopPart data={data} />
      {/* <ReportRoom data={data} /> */}
    </div>
  );
};

export default SinglePorpertyAccards;
