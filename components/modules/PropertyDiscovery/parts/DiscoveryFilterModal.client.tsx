"use client";

import type { DiscoveryFilterModalProps } from "@/types/components/modules/property-discovery";
import { PropertyFilterForm } from "@modules/PropertySearchFilters";
import { CitySelectorTitle } from "@modules/CitySelector";
import { ModalHeaderPart } from "@elements/Modal";
import { ContentImage } from "@elements/Image";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

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
        "mx-auto my-0 xl:my-10 h-full w-full xl:w-1/3 2xl:w-1/4 rounded-0 overflow-y-scroll bg-white pb-32",
    }}
  >
    <ModalHeaderPart title={_STRINGS.FILTERS} onHide={onClose}>
      {onClearExtraFilters ? (
        <button
          type="button"
          onClick={onClearExtraFilters}
          className="absolute flex items-center gap-2 left-4 md:left-12"
        >
          <span className="text-sm text-brand-600">
            {_STRINGS.REMOVE_FILTERS}
          </span>
          <ContentImage
            alt=""
            width={16}
            height={16}
            src="/assets/icons/property/blue_trash_icon.svg"
          />
        </button>
      ) : null}
    </ModalHeaderPart>

    <div className="w-[90%] mx-auto">
      <div className="w-full pt-4 pb-8">
        <CitySelectorTitle
          hideCityPart
          queries={queries}
          title={cityTitle}
          cb={onShowCityModal}
          setShowRegions={setShowRegions}
          cityWithRegions={cityWithRegions}
        />
        <PropertyFilterForm
          filters={filters}
          queries={queries}
          setFilters={setFilters}
          propertyTypes={propertyTypes}
          hiddenFilters={hiddenFilters}
        />
      </div>
      <div className="w-full pb-6 fixed bottom-0 right-0 bg-white z-1 border-t">
        <Button
          width="w-full"
          onClick={onApply}
          title={_STRINGS?.DO_THE_FILTERING}
          containerClass="w-full flex items-center flex-col px-2 pb-2 pt-6"
        />
      </div>
    </div>
  </Modal>
);

export default DiscoveryFilterModal;
