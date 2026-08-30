import type { SingleLandingDto } from "@/api_services/property/property.interface";
import type { DeviceInfo } from "@/helpers/device.detector";

export type RoomsTemplateProps = {
  devices?: DeviceInfo;
};

export type LandingTemplateProps = {
  devices?: DeviceInfo;
  landing: SingleLandingDto;
};
