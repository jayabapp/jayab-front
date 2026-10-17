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
import PropertyOwnerBadge from "./parts/PropertyOwnerBadge";
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

const SUB_HEADING_CLASS = "text-base font-bold text-ink";

const PropertyDetailsContent = ({ property }: PropertyDetailsContentProps) => {
  const t = useTranslations();
  const sep = useListSeparator();

  const view = toPropertyDetailsView(property);
  const amenities = toAmenityItems(property);

  const place = [view?.city, view?.region || view?.province]
    .filter(Boolean)
    .join(sep);

  const hasDescription = Boolean(
    property?.property_descriptions?.ad_dscr ||
    property?.property_descriptions?.property_dscr,
  );

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
      <div className="mx-auto flex w-full max-w-6xl flex-col">
        <ListingHeader breadcrumbs={breadCrumbs} property={view} />

        <div className="order-1 w-full md:order-2">
          <PropertyGallery
            title={view.title}
            images={view.images}
            hostName={view.ownerName}
            advisorCommission={view.advisorCommission}
          />
        </div>

        <div className="order-3 grid grid-cols-1 gap-x-12 pt-6 md:grid-cols-12 md:pt-8">
          <div className="flex w-full min-w-0 flex-col md:col-span-7 lg:col-span-8">
            {view.ownerName || view.ownerAvatar ? (
              <div className="pb-5">
                <PropertyOwnerBadge
                  name={view.ownerName}
                  avatar={view.ownerAvatar}
                  nameLang={view.ownerNameLocale}
                  isOnline={view.hasActiveSubscription}
                />
              </div>
            ) : null}

            <div className="pb-6">
              <KeyFacts property={property} />
            </div>

            <SectionTabs tabs={tabs} />

            <ListingSection
              id="specs"
              title={
                hasDescription ? t("common.propDesc") : t("listing.tabSpecs")
              }
            >
              <PropertyDescription property={property} />

              <div className="flex flex-col gap-3">
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
              <StayCalendarSection propertyId={view.id} />
              <ExtraCosts property={property} />
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
                nameLang={view.ownerNameLocale}
                isAuthorized={view.isAuthorized}
                isOnline={view.hasActiveSubscription}
              />
              <PropertyReportRow propertyId={view.id} />
            </ListingSection>
          </div>

          <aside className="w-full md:col-span-5 lg:col-span-4">
            <PropertySummaryCard property={view} />
          </aside>
        </div>

        <div className="order-4 flex flex-col">
          <SimilarProperties propertyId={view.id} city={view.city}>
            <RelatedLandingLinks city={view.city} seoLinks={view.seoLinks} />
          </SimilarProperties>
        </div>
      </div>
    </ContactFlow>
  );
};

export default PropertyDetailsContent;
