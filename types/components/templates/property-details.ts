import type { SinglePropDto } from "@/api_services/property/property.interface";
import type { DeviceInfo } from "@/helpers/device.detector";
import type { ReactNode } from "react";

export type PropertyDetailsTemplateProps = {
  schema?: ReactNode;
  devices?: DeviceInfo;
  property: SinglePropDto;
};
