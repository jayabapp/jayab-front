import { RateTable, StayCalendarSection } from "@modules/PropertyBooking";
import { toPropertyDetailsView } from "@features/properties/mappers/property-details.mapper";
import { PropertyGallery } from "@modules/PropertyGallery";
import { toAmenityItems } from "@features/properties/mappers/amenities.mapper";
import { ContactFlow } from "@modules/PropertyContact";

import type { PropertyDetailsContentProps } from "@/types/components/modules/property-details";
import type { SectionTab } from "@/types/components/modules/property-details";

import SleepingArrangements from "./parts/SleepingArrangements";
import PropertySummaryCard from "./PropertySummaryCard.client";
import PropertyDescription from "./parts/PropertyDescription";
import RelatedLandingLinks from "./parts/RelatedLandingLinks";
import PropertyReportRow from "./parts/PropertyReportRow.client";
import SimilarProperties from "./parts/SimilarProperties.client";
import LocationSection from "./parts/LocationSection";
import ListingSection from "./parts/ListingSection";
import ListingHeader from "./ListingHeader";
import Surroundings from "./parts/Surroundings";
import SectionTabs from "./parts/SectionTabs.client";
import ExtraCosts from "./parts/ExtraCosts";
import HouseRules from "./parts/HouseRules";
import Amenities from "./parts/Amenities.client";
import _STRINGS from "@/utils/LocalStrings";
import HostCard from "./parts/HostCard";
import KeyFacts from "./parts/KeyFacts";

const SUB_HEADING_CLASS = "text-sm font-bold text-neutral-900";

const PropertyDetailsContent = ({ property }: PropertyDetailsContentProps) => {
  const view = toPropertyDetailsView(property);
  const amenities = toAmenityItems(property);

  const place = [view?.city, view?.region || view?.province]
    .filter(Boolean)
    .join("، ");

  const breadCrumbs = [
    { title: _STRINGS.HOME, link: "/" },
    { title: _STRINGS.ADDS, link: "/rooms" },
    { title: property?.title || "", link: "#" },
  ];

  const tabs: SectionTab[] = [
    { id: "specs", label: _STRINGS.TAB_SPECS },
    ...(amenities.length
      ? [{ id: "amenities", label: _STRINGS.TAB_AMENITIES }]
      : []),
    { id: "calendar", label: _STRINGS.TAB_CALENDAR },
    { id: "rules", label: _STRINGS.TAB_RULES },
    { id: "location", label: _STRINGS.TAB_LOCATION },
    { id: "host", label: _STRINGS.TAB_HOST },
  ];

  return (
    <ContactFlow property={view}>
      {/*
        SL-18: mobile keeps photo -> section-nav tabs -> title/location/specs
        -> "ویلا به میزبانی" above the fold; desktop keeps the original
        header-first order. `md:contents` drops the wrapper box on desktop so
        DOM order (header, gallery, tabs) is what renders there, while the
        `order-*` utilities only take effect while the wrapper is `flex` (mobile).
      */}
      <div className="flex flex-col md:contents">
        <div className="order-1">
          <PropertyGallery
            title={view.title}
            images={view.images}
            hostName={view.ownerName}
            advisorCommission={view.advisorCommission}
          />
        </div>

        <div className="order-2">
          <SectionTabs tabs={tabs} />
        </div>

        <div className="order-3">
          <ListingHeader breadcrumbs={breadCrumbs} property={view} />
        </div>

        {view.ownerName ? (
          <p className="order-4 pb-4 text-sm text-neutral-600 md:hidden">
            {_STRINGS.VILLA_HOSTED_BY} {view.ownerName}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-12">
        <div className="flex w-full flex-col md:col-span-7 lg:col-span-8">
          <ListingSection id="specs" title={_STRINGS.TAB_SPECS}>
            <KeyFacts property={property} />
            <PropertyDescription property={property} />

            <div className="flex flex-col gap-4">
              <h3 className={SUB_HEADING_CLASS}>{_STRINGS.SLEEPING_SPACE}</h3>
              <SleepingArrangements property={property} />
            </div>
          </ListingSection>

          {amenities.length ? (
            <ListingSection id="amenities" title={_STRINGS.TAB_AMENITIES}>
              <Amenities property={property} />

              <div className="flex flex-col gap-4">
                <h3 className={SUB_HEADING_CLASS}>{_STRINGS.EXTRA_COSTS}</h3>
                <ExtraCosts property={property} />
              </div>
            </ListingSection>
          ) : (
            <></>
          )}

          <ListingSection id="calendar" title={_STRINGS.TAB_CALENDAR}>
            <StayCalendarSection propertyId={view.id} />
            <RateTable
              stdCapacity={view.stdCapacity}
              cleaningFee={view.cleaningFee}
              dailyPrice={property?.daily_price}
              extraGuestFee={view.extraGuestFee}
            />
          </ListingSection>

          <ListingSection id="rules" title={_STRINGS.PROP_TERMS}>
            <HouseRules property={property} />
          </ListingSection>

          <ListingSection id="location" title={_STRINGS.LOCATION_SECTION_TITLE}>
            <LocationSection
              place={place}
              latitude={property?.latitude}
              longitude={property?.longitude}
              approxLocation={property?.approx_location}
            />
            <Surroundings property={property} />
          </ListingSection>

          <ListingSection id="host" title={_STRINGS.TAB_HOST} divider={false}>
            <HostCard
              name={view.ownerName}
              avatar={view.ownerAvatar}
              isAuthorized={view.isAuthorized}
              since={view.ownerSince}
            />
            <div className="pt-2">
              <PropertyReportRow propertyId={view.id} />
            </div>
          </ListingSection>

          <SimilarProperties propertyId={view.id} city={view.city} />
          <RelatedLandingLinks city={view.city} seoLinks={view.seoLinks} />
        </div>

        <aside className="w-full md:col-span-5 lg:col-span-4">
          <PropertySummaryCard property={view} />
        </aside>
      </div>
    </ContactFlow>
  );
};

export default PropertyDetailsContent;
