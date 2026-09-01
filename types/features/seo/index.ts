import type { Category, ContentDto } from "@/api_services/home/home.interface";
import type { SinglePropDto } from "@/api_services/property/property.interface";

export type ServiceStructuredDataProps = {
  service: Category;
};

export type BlogStructuredDataProps = {
  data: ContentDto;
  rate: number;
  rate_count: number;
  timeToRead: number;
  wordCount: number;
};

export type PropertyStructuredDataProps = {
  data: SinglePropDto;
};

export type ContentFaqStructuredDataProps = {
  faqData: { innerText: string; title: string }[];
};
