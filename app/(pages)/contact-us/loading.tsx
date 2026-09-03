import CmsContentSkeleton from "@elements/Skeleton/CmsContentSkeleton";

const ContentPageLoading = () => (
  <main
    aria-busy="true"
    className="route-enter container transition-all duration-500 ease-in-out"
  >
    <CmsContentSkeleton />
  </main>
);

export default ContentPageLoading;
