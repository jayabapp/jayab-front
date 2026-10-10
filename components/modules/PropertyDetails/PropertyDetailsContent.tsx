import { toPropertyDetailsView } from "@features/properties/mappers/property-details.mapper";
import { StayCalendarSection } from "@modules/PropertyBooking";
import { useListSeparator } from "@hooks/useListSeparator";
import { useTranslations } from "next-intl";
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
import HostCard from "./parts/HostCard";
import KeyFacts from "./parts/KeyFacts";

const SUB_HEADING_CLASS = "text-sm font-bold text-ink";

const PropertyDetailsContent = ({ property }: PropertyDetailsContentProps) => {
  const t = useTranslations();
  const sep = useListSeparator();

  const view = toPropertyDetailsView(property);
  const amenities = toAmenityItems(property);

  const place = [view?.city, view?.region || view?.province]
    .filter(Boolean)
    .join(sep);

  const breadCrumbs = [
    { title: t("common.home"), link: "/" },
    { title: t("header.listings"), link: "/rooms" },
    { title: property?.title || "", link: "#" },
  ];

  const tabs: SectionTab[] = [
    { id: "specs", label: t("listing.tabSpecs") },
    ...(amenities.length
      ? [{ id: "amenities", label: t("listing.tabAmenities") }]
      : []),
    { id: "calendar", label: t("listing.tabCalendar") },
    { id: "rules", label: t("listing.tabRules") },
    { id: "location", label: t("listing.tabLocation") },
    { id: "host", label: t("listing.tabHost") },
  ];

  return (
    <ContactFlow property={view}>
      <ListingHeader breadcrumbs={breadCrumbs} property={view} />
      <PropertyGallery
        title={view.title}
        images={view.images}
        hostName={view.ownerName}
        advisorCommission={view.advisorCommission}
      />

      <SectionTabs tabs={tabs} />

      {view.ownerName ? (
        <p className="order-4 pb-4 ui-body text-ink-muted md:hidden">
          {t("listing.villaHostedBy")} {view.ownerName}
        </p>
      ) : null}

      <div className="order-5 grid grid-cols-1 gap-x-8 md:grid-cols-12">
        <div className="flex w-full flex-col md:col-span-7 lg:col-span-8">
          <ListingSection id="specs" title={t("listing.tabSpecs")}>
            <KeyFacts property={property} />
            <PropertyDescription property={property} />

            <div className="flex flex-col gap-4">
              <h3 className={SUB_HEADING_CLASS}>
                {t("listing.sleepingSpace")}
              </h3>
              <SleepingArrangements property={property} />
            </div>
          </ListingSection>

          {amenities.length ? (
            <ListingSection id="amenities" title={t("listing.tabAmenities")}>
              <Amenities property={property} />
            </ListingSection>
          ) : (
            <></>
          )}

          <ListingSection id="calendar" title={t("listing.tabCalendar")}>
            <div className="flex flex-col gap-4">
              <h3 className={SUB_HEADING_CLASS}>{t("listing.extraCosts")}</h3>
              <ExtraCosts property={property} />
            </div>
            <StayCalendarSection propertyId={view.id} />
          </ListingSection>

          <ListingSection id="rules" title={t("listing.propTerms")}>
            <HouseRules property={property} />
          </ListingSection>

          <ListingSection
            id="location"
            title={t("listing.locationSectionTitle")}
          >
            <LocationSection
              place={place}
              latitude={property?.latitude}
              longitude={property?.longitude}
              approxLocation={property?.approx_location}
            />
            <Surroundings property={property} />
          </ListingSection>

          <ListingSection
            id="host"
            divider={false}
            title={t("listing.tabHost")}
          >
            <HostCard
              name={view.ownerName}
              since={view.ownerSince}
              avatar={view.ownerAvatar}
              isAuthorized={view.isAuthorized}
              isOnline={view.hasActiveSubscription}
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
