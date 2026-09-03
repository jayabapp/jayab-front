import type { PropertyGridItemsProps } from "@/types/components/modules/property-grid";

import PropertyGridBanner from "./parts/PropertyGridBanner.client";
import PropertyShowcaseCard from "./PropertyShowcaseCard";
import PropertyCard from "./PropertyCard";

const MOBILE_BANNER_ROW_STEP = 7;
const DESKTOP_BANNER_ROW_STEP = 3;

const PropertyGridItems = ({
  data,
  week,
  devices,
  banners,
  variant = "detailed",
}: PropertyGridItemsProps) => {
  const rowStep = devices?.isMobile
    ? MOBILE_BANNER_ROW_STEP
    : DESKTOP_BANNER_ROW_STEP;

  return (
    <>
      {banners?.map((banner, index) => (
        <div
          key={`banner-${banner?.id}`}
          className="col-span-full"
          style={{ gridRowStart: (index + 1) * rowStep }}
        >
          <PropertyGridBanner devices={devices} bannerItem={banner} />
        </div>
      ))}
      {data?.map((property, index) =>
        variant === "showcase" ? (
          <PropertyShowcaseCard
            index={index}
            data={property}
            key={`property-${property?.id}`}
          />
        ) : (
          <PropertyCard
            week={week}
            data={property}
            key={`property-${property?.id}`}
          />
        ),
      )}
    </>
  );
};

export default PropertyGridItems;
