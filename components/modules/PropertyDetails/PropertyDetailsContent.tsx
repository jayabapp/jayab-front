import type { PropertyDetailsContentProps } from "@/types/components/modules/property-details";
import { toPropertyDetailsView } from "@features/properties/mappers/property-details.mapper";
import { PropertyCalendar } from "@modules/PropertyAvailability";
import { PropertyGallery } from "@modules/PropertyGallery";

import SingleProductBreadCrumb from "@elements/Breadcrumbs/SingleProductBreadcrumb.client";
import PropertySummaryCard from "./PropertySummaryCard.client";
import PropertyDescription from "./parts/PropertyDescription";
import PropertySpecs from "./PropertySpecs";
import _STRINGS from "@/utils/LocalStrings";

const PANEL_CLASS = "surface-panel p-4 md:p-5";

const PropertyDetailsContent = ({
  devices,
  property,
}: PropertyDetailsContentProps) => {
  const view = toPropertyDetailsView(property);
  const breadCrumbs = [
    { title: _STRINGS.HOME, link: "/" },
    { title: _STRINGS.ADDS, link: "/rooms" },
    { title: property?.title || "", link: "#" },
  ];

  return (
    <>
      <div className="col-span-full hidden w-full md:flex">
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>

      <div className="enter-from-right col-span-full w-full md:col-span-2">
        <PropertyGallery
          title={view.title}
          images={view.images}
          advisorCommission={view.advisorCommission}
        />
        <div className="mt-3 flex w-full md:hidden">
          <SingleProductBreadCrumb dataArray={breadCrumbs} />
        </div>
      </div>

      <div className="enter-from-left col-span-full w-full md:col-span-1 md:row-span-2">
        <PropertySummaryCard property={view} />
      </div>

      <div className="enter-from-right col-span-full flex w-full flex-col gap-4 md:col-span-2">
        <PropertyDescription property={property} />

        <div className={PANEL_CLASS}>
          <PropertyCalendar propertyId={view.id} />
        </div>

        <PropertySpecs property={property} devices={devices} />
      </div>
    </>
  );
};

export default PropertyDetailsContent;
