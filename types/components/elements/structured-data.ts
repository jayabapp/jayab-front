export type BreadcrumbStructuredDataItem = {
  link?: string;
  route?: string;
  title: string;
};

export type BreadcrumbStructuredDataProps = {
  breadcrumbs: BreadcrumbStructuredDataItem[];
};

export type StructuredDataProps = {
  data: {
    description?: string;
    image?: string[];
    name?: string;
    others?: Record<string, unknown>;
    type: string;
    url?: string;
  };
};
