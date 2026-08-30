import type { PropertyDetailsContentProps } from "@/types/components/modules/property-details";
import { toPropertyDetailsView } from "@features/properties/mappers/property-details.mapper";
import { PropertyCalendar } from "@modules/PropertyAvailability";
import { PropertyGallery } from "@modules/PropertyGallery";

import SingleProductBreadCrumb from "@/components/BreadCrumbs/SingleProductBreadCrumb";
import PropertyIntroduction from "./PropertyIntroduction.client";
import PropertySpecs from "./PropertySpecs";
import _STRINGS from "@/utils/LocalStrings";

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
      <div className="w-full col-span-full hidden md:flex">
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>

      <PropertyGallery
        title={view.title}
        images={view.images}
        advisorCommission={view.advisorCommission}
      />

      <div className="w-full col-span-full flex md:hidden">
        <SingleProductBreadCrumb dataArray={breadCrumbs} />
      </div>

      <PropertyIntroduction property={view} />
      <PropertySpecs property={property} devices={devices} />
      <PropertyCalendar propertyId={view.id} />
    </>
  );
};

export default PropertyDetailsContent;
