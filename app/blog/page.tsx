import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import Blogs from "@/components/SinglePageComponents/Blogs";
import { Suspense } from "react";

// This component passed as fallback to the Suspense boundary
// will be rendered in place of the search bar in the initial HTML.
// When the value is available during React hydration the fallback
// will be replaced with the `<SearchBar>` component.
function Fallback() {
  return <LottieLoading />;
}

export default function BlogsPage() {
  return (
    <>
      <Suspense fallback={<Fallback />}>
        <Blogs />
      </Suspense>
    </>
  );
}
