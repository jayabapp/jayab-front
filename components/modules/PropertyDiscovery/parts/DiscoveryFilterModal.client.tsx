"use client";

import { PropertyFilterForm } from "@modules/PropertySearchFilters";
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
  setFilters,
  hiddenFilters,
  propertyTypes,
  baselineFilters,
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
      <PropertyFilterForm
        filters={filters}
        queries={queries}
        setFilters={setFilters}
        onReset={onClearExtraFilters}
        propertyTypes={propertyTypes}
        hiddenFilters={hiddenFilters}
        regions={cityWithRegions?.child}
        baselineFilters={baselineFilters}
      />
    </div>

    <FilterApplyBar draft={filters} onApply={onApply} enabled={show} />
  </Modal>
);

export default DiscoveryFilterModal;
