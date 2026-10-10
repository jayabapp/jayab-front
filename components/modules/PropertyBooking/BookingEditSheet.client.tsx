"use client";

import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";
import { useTranslations } from "next-intl";

import type { BookingEditSheetProps } from "@/types/components/modules/property-booking";

import BookingPanel from "./BookingPanel.client";

const BookingEditSheet = ({
  show,
  onHide,
  property,
  renderActions,
}: BookingEditSheetProps) => {
  const t = useTranslations("reserve");

  return (
    <ModalBottomSheet show={show} onHide={onHide}>
      <ModalHeaderPart showX hideArrow onHide={onHide} title={t("editStay")} />
      <BookingPanel
        variant="sheet"
        property={property}
        renderActions={renderActions}
      />
    </ModalBottomSheet>
  );
};

export default BookingEditSheet;
