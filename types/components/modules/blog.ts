import type { QuestionDto } from "@/api_services/home/home.interface";
import type { ContentDto } from "@/api_services/home/home.interface";
import type { ReactNode } from "react";
import type { ImageDto } from "@/api_services/auth/auth.interface";

export type BlogCardProps = {
  index?: number;
  item: ContentDto;
};

export type BlogsContainerProps = {
  title: string;
  viewAllUrl: string;
  data?: ContentDto[];
};

export type BlogArticleHeaderProps = {
  breadcrumb?: { link: string; title: string }[];
  data?: ContentDto;
  timeToRead?: number;
};

export type BlogTableOfContentsProps = {
  headings: { id: string; innerText: string }[];
};

export type BlogCategoryQuery = {
  q?: string;
  page?: string;
  tag_ids?: string;
  brand_id?: string;
  store_id?: string;
  sort_type: string;
  max_price?: string;
  min_price?: string;
  max_weight?: string;
  store_name?: string;
  min_weight?: string;
  properties?: string[];
  is_new?: "false" | "true";
  is_offer?: "false" | "true";
  categories?: string | string[];
};

export type CategoryBlogsProps = {
  queryPage: number | string | null;
};

export type BlogDetailsTemplateProps = {
  html: string;
  data: ContentDto;
  timeToRead: number;
  breadcrumb: { link: string; title: string }[];
  headings: { id: string; innerText: string }[];
};

export type BlogGalleryProps = { images: ImageDto[] };
export type BlogGalleryItemProps = { item: ImageDto; onPress: () => void };
export type BlogGalleryModalProps = {
  _onHide: () => void;
  images: ImageDto[];
  isVisible: number;
};
export type BlogShareProps = { data: ContentDto };
export type RelatedBlogsProps = { currentId: number; items: ContentDto[] };
export type RelatedBlogsSectionProps = { currentId: number };
export type ContentQuestionCommentProps = { item: QuestionDto };

export type BlogCardLinkProps = {
  href: string;
  title?: string;
  className?: string;
  children: ReactNode;
};

export type TMetaItem = {
  icon: string;
  label: string;
  value: string;
};

export type TGalleryItem = {
  _onPress: () => void;
  item: BlogGalleryProps["images"][number];
};
