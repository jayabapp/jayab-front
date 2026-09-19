"use client";

import type { BookingEditSheetProps } from "@/types/components/modules/property-booking";
import { ModalBottomSheet, ModalHeaderPart } from "@elements/Modal";

import BookingPanel from "./BookingPanel.client";
import _STRINGS from "@/utils/LocalStrings";

const BookingEditSheet = ({
  show,
  onHide,
  property,
  renderActions,
}: BookingEditSheetProps) => (
  <ModalBottomSheet show={show} onHide={onHide}>
    <ModalHeaderPart hideArrow onHide={onHide} title={_STRINGS.EDIT_STAY} />
    <BookingPanel
      variant="sheet"
      property={property}
      renderActions={renderActions}
    />
  </ModalBottomSheet>
);

export default BookingEditSheet;
