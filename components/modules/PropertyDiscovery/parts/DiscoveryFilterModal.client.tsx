"use client";

import type { DiscoveryFilterModalProps } from "@/types/components/modules/property-discovery";
import { FilterApplyBar, PropertyFilterForm } from "@modules/PropertySearchFilters";
import { CitySelectorTitle } from "@modules/CitySelector";
import { ModalHeaderPart } from "@elements/Modal";

import Modal from "@elements/Modal";

/**
 * The mobile face of the same panel the desktop sidebar renders.
 *
 * Reset lives inside `PropertyFilterForm`'s own header rather than in the modal
 * chrome, so it sits beside the active-filter count that explains what it would
 * clear — and so the two form factors do not grow separate affordances for the
 * same action.
 */
const DiscoveryFilterModal = ({
  cityTitle,
  cityWithRegions,
  filters,
  hiddenFilters,
  onApply,
  onClearExtraFilters,
  onClose,
  onShowCityModal,
  propertyTypes,
  queries,
  setFilters,
  setShowRegions,
  show,
}: DiscoveryFilterModalProps) => (
  <Modal
    show={show}
    onHide={onClose}
    options={{
      containerClass:
        "mx-auto my-0 xl:my-10 h-full w-full xl:w-1/3 2xl:w-1/4 rounded-0 bg-white flex flex-col overflow-hidden",
    }}
  >
    {/* Title-less on purpose: `PropertyFilterForm` opens with its own pinned
        header, and naming the sheet twice in two stacked bars just costs a row
        of a viewport that has few to spare. */}
    <ModalHeaderPart showX title="" onHide={onClose} />

    {/* The list scrolls; the submit bar does not. Previously the button was
        `fixed` to the viewport from inside a 90%-wide box, which put it out of
        step with the sheet it belongs to. */}
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
