import type { ContentDto } from "@/api_services/home/home.interface";
import type { ImageDto } from "@/api_services/auth/auth.interface";
import type { QuestionDto } from "@/api_services/home/home.interface";
import type { ReactNode } from "react";

export type ArticleProps = {
  data: ContentDto;
  item?: { customeImageClass?: string };
};

export type BlogCardProps = {
  item: ContentDto;
};

export type BlogsContainerProps = {
  title: string;
  viewAllUrl: string;
  data?: ContentDto[];
};

export type BlogImageTextProps = {
  data?: ContentDto;
  timeToRead?: number;
  children?: ReactNode;
  breadcrumb?: { link: string; title: string }[];
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

export type LegacyBlogImageTextProps = {
  children?: ReactNode;
  data?: {
    title?: string;
    full_text: string;
    small_text?: string;
    feature_image: ImageDto;
    created_at?: number | string;
  };
};

export type BlogDetailsTemplateProps = {
  html: string;
  data: ContentDto;
  timeToRead: number;
  relatedBlogs: ContentDto[];
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
export type ContentQuestionCommentProps = { item: QuestionDto };
