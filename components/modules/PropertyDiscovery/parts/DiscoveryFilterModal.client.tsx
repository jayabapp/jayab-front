"use client";

import { PropertyFilterForm } from "@modules/PropertySearchFilters";
import { CitySelectorTitle } from "@modules/CitySelector";
import { ModalHeaderPart } from "@elements/Modal";
import { FilterApplyBar } from "@modules/PropertySearchFilters";

import type { DiscoveryFilterModalProps } from "@/types/components/modules/property-discovery";

import Modal from "@elements/Modal";

const DiscoveryFilterModal = ({
  show,
  filters,
  onApply,
  onClose,
  queries,
  cityTitle,
  setFilters,
  hiddenFilters,
  propertyTypes,
  setShowRegions,
  baselineFilters,
  onShowCityModal,
  cityWithRegions,
  onClearExtraFilters,
}: DiscoveryFilterModalProps) => (
  <Modal
    show={show}
    onHide={onClose}
    options={{ containerClass: "discovery-filter-dialog" }}
  >
    <ModalHeaderPart showX title="" onHide={onClose} />

    <div className="min-h-0 w-full grow overflow-y-auto overscroll-contain pb-4">
      <div className="mx-auto w-[92%] pb-2">
        <CitySelectorTitle
          hideCityPart
          queries={queries}
          title={cityTitle}
          cb={onShowCityModal}
          setShowRegions={setShowRegions}
          cityWithRegions={cityWithRegions}
        />
      </div>
      <PropertyFilterForm
        filters={filters}
        queries={queries}
        setFilters={setFilters}
        onReset={onClearExtraFilters}
        propertyTypes={propertyTypes}
        hiddenFilters={hiddenFilters}
        baselineFilters={baselineFilters}
      />
    </div>

    <FilterApplyBar draft={filters} onApply={onApply} enabled={show} />
  </Modal>
);

export default DiscoveryFilterModal;
