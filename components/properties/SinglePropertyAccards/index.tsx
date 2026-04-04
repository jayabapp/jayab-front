import { SinglePropDto } from "@/api_services/property/property.interface";
import EnvAccard from "./EnvAccard";
import FeatAccard from "./FeatAccard";
import GeneralFeatAccard from "./GeneralFeatAccard";
import GuestAccard from "./GuestAccard";
import MapPopupPart from "./MapPopupPart";
import PrimaryAccard from "./PrimaryAccard";
import ReportRoom from "./ReportRoom";
import RoomAccard from "./RoomAccard";
import RulesAccardion from "./RulesAccardion";

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
      {/* <RulesPopPart data={data} /> */}
      <RulesAccardion data={data} />
      <ReportRoom data={data} />
    </div>
  );
};

export default SinglePorpertyAccards;
