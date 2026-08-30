export type {
  PropertyListDto,
  RelatedLandings,
  SingleLandingDto,
} from "@/api_services/property/property.interface";

import type { PageMetaDto, PropertyListDto } from "@/api_services/property/property.interface";

export type PropertyDiscoveryFilters = Record<string, any>;

export type PropertyListPage = {
  data: PropertyListDto[];
  meta: PageMetaDto;
};
