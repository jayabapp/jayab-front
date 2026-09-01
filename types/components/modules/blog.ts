import type { ContentDto } from "@/api_services/home/home.interface";
import type { ReactNode } from "react";

export type ArticleProps = {
  data: ContentDto;
  item?: { customeImageClass?: string };
};

export type BlogCardProps = {
  item: ContentDto;
};

export type BlogsContainerProps = {
  data?: ContentDto[];
  title: string;
  viewAllUrl: string;
};

export type BlogImageTextProps = {
  breadcrumb?: { link: string; title: string }[];
  children?: ReactNode;
  data?: ContentDto;
  timeToRead?: number;
};
