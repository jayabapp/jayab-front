import type { ContentByKeyDto, ContentDto } from "@/api_services/home/home.interface";
import type { ReactNode } from "react";

export type AboutUsContentProps = { content?: ContentByKeyDto | null };
export type FaqContentProps = { items?: ContentDto[] | null };
export type TermsContentProps = { content?: ContentByKeyDto | null };
export type ContentPageTemplateProps = { children: ReactNode; schema?: ReactNode };
