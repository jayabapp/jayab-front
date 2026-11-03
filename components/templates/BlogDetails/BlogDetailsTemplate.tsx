import type { ContentPageTemplateProps } from "@/types/components/modules/content-pages";

const BlogDetailsTemplate = ({ children, schema }: ContentPageTemplateProps) => <>{schema}{children}</>;

export default BlogDetailsTemplate;
