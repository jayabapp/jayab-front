import type { ContentPageTemplateProps } from "@/types/components/modules/content-pages";

const AboutUsTemplate = ({ children, schema }: ContentPageTemplateProps) => (
  <>
    {schema}
    {children}
  </>
);

export default AboutUsTemplate;
