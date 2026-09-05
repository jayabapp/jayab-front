import type { ContentDto } from "@/api_services/home/home.interface";

export type ContactUsItemProps = {
  disableText?: boolean;
  e: ContentDto;
  isShiny?: boolean;
  textClass?: string;
};

export type ContactUsPageProps = {
  data?: { data?: ContentDto[] };
};

export type ContactMapProps = {
  latitude: number;
  longitude: number;
};
