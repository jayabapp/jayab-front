// Imported from the skeleton file rather than the module barrel on purpose: a
// route loading boundary is evaluated during prerender, and going through the
// index would drag the module's client islands and feature hooks into that
// graph for the sake of one static component.
import AdvisorCardSkeleton from "@modules/AdvisorDetails/AdvisorCardSkeleton";

const CARD_COUNT = 6;

const AdvisorsLoading = () => (
  <main aria-busy="true" className="route-enter w-full container">
    <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: CARD_COUNT }, (_, index) => (
        <AdvisorCardSkeleton key={index} />
      ))}
    </div>
  </main>
);

export default AdvisorsLoading;
