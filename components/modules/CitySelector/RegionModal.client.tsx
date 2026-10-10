"use client";

import { useRegionSelection } from "@features/cities/hooks/useRegionSelection";
import { ModalHeaderPart } from "@elements/Modal";
import { useTranslations } from "next-intl";

import type { RegionModalProps } from "@/types/components/modules/city-selector";

import SelectedRegionChips from "./parts/SelectedRegionChips";
import CitySearchInput from "./parts/CitySearchInput";
import EmptyState from "@elements/EmptyState";
import CityCard from "./parts/CityCard";
import isEmpty from "lodash/isEmpty";
import Button from "@elements/Button";
import Modal from "@elements/Modal";

const RegionModal = ({
  cityWithRegions,
  onHide,
  passedUrl,
  show,
}: RegionModalProps) => {
  const t = useTranslations();

  const {
    submit,
    search,
    regions,
    setSearch,
    toggleRegion,
    visibleRegions,
    selectedRegions,
  } = useRegionSelection({ cityWithRegions, navigateUrl: passedUrl });

  const onSubmitClick = () => {
    submit();
    onHide();
  };

  return (
    <Modal
      show={!!show}
      onHide={onHide}
      zIndex={40000000}
      options={{
        containerClass:
          "mx-auto my-0 md:my-20 w-full md:w-1/2 xl:w-1/3 2xl:w-1/4 rounded-0 md:rounded-2xl overflow-y-scroll bg-surface relative min-h-[100dvh] min:min-h-[80dvh]",
      }}
    >
      <ModalHeaderPart showX onHide={onHide} title={t("common.local")} />
      <div className="w-full flex flex-col gap-4 mt-4 p-3 h-auto min-h-full">
        <CitySearchInput
          value={search}
          onChange={setSearch}
          options={{ placeholder: t("search.searchRegion") }}
        />
        <SelectedRegionChips
          onRegionClick={toggleRegion}
          selectedRegions={selectedRegions}
        />

        {isEmpty(regions) ? (
          <EmptyState />
        ) : (
          visibleRegions.map((region) => (
            <CityCard
              item={region}
              key={`region-${region?.id}`}
              callback={() => toggleRegion(region)}
              isChecked={selectedRegions.some(
                (entry) => entry?.id === region?.id,
              )}
            />
          ))
        )}
      </div>

      <div className="bg-surface shadow-surface w-full py-4 flex items-center sticky gap-4 px-[10%] bottom-0">
        <Button
          width="w-full"
          onClick={onSubmitClick}
          title={t("common.submit")}
          containerClass="flex w-full items-center justify-center"
        />
      </div>
    </Modal>
  );
};

export default RegionModal;
