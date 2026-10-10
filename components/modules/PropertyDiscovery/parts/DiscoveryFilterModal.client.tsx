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
  onShowCityModal,
  cityWithRegions,
  onClearExtraFilters,
}: DiscoveryFilterModalProps) => (
  <Modal
    show={show}
    onHide={onClose}
    options={{
      containerClass:
        "mx-auto my-0 xl:my-10 h-full w-full xl:w-1/3 2xl:w-1/4 rounded-0 bg-surface flex flex-col overflow-hidden",
    }}
  >
    <ModalHeaderPart showX title="" onHide={onClose} />

    <div className="w-full grow overflow-y-auto pb-4">
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
      />
    </div>

    <FilterApplyBar draft={filters} onApply={onApply} enabled={show} />
  </Modal>
);

export default DiscoveryFilterModal;
