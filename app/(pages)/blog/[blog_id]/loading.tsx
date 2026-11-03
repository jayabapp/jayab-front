// Imported from the skeleton file rather than the module barrel on purpose: a
// route loading boundary is evaluated during prerender, and going through the
// index would drag the module's client islands and feature hooks into that
// graph for the sake of one static component.
import BlogDetailsSkeleton from "@modules/BlogDetails/BlogDetailsSkeleton";

const BlogDetailsLoading = () => <BlogDetailsSkeleton />;

export default BlogDetailsLoading;
