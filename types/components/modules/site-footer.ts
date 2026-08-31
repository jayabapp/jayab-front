import type { ContentByKeyDto } from "@/api_services/home/home.interface";
import type { ContentDto } from "@/api_services/home/home.interface";

export type FooterContentEntry = ContentDto;

export type FooterCallBoxProps = {
  content: ContentByKeyDto | null;
};

export type FooterHostCtaProps = {
  link: string;
  title: string;
};

export type FooterQuickSearchProps = {
  links: ContentDto[];
};

export type FooterContactColumnProps = {
  contacts: ContentDto[];
};

export type FooterSocialRowProps = {
  socials: ContentDto[];
  className?: string;
};

export type FooterAboutColumnProps = {
  socials: ContentDto[];
  about: ContentByKeyDto | null;
};

export type FooterCallFabProps = {
  phone?: ContentDto;
};

export type FooterBottomBarProps = {
  downloadLinks: ContentDto[];
};
