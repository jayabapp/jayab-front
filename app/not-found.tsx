import NotFOund from "@/components/SinglePageComponents/NotFound";
import { Suspense } from "react";

// This component passed as fallback to the Suspense boundary
// will be rendered in place of the search bar in the initial HTML.
// When the value is available during React hydration the fallback
// will be replaced with the `<SearchBar>` component.
function FallBack() {
  return <></>;
}

export default function NotFound() {
  return (
    <>
      <nav>
        <Suspense fallback={<FallBack />}>
          <NotFOund />
        </Suspense>
      </nav>
    </>
  );
}
