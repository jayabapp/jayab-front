import type { ContentDto } from "@/api_services/home/home.interface";

export type ContactUsItemProps = {
  disableText?: boolean;
  e: ContentDto;
};

export type ContactUsPageProps = {
  data?: { data?: ContentDto[] };
};
