import type { ContentPageTemplateProps } from "@/types/components/modules/content-pages";

const FaqTemplate = ({ children, schema }: ContentPageTemplateProps) => (
  <>
    {schema}
    {children}
  </>
);

export default FaqTemplate;
