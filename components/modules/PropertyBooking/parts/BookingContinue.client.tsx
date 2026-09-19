"use client";

import type { BookingActionsContext } from "@/types/components/modules/property-booking";
import type { PropertyDetailsView } from "@/types/features/properties";
import { ReserveRequestModal } from "@modules/PropertyContact";
import { useAuthStore, useStoreParams } from "@/store";
import { useState } from "react";

import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import moment from "moment-jalaali";

const JALALI_DATE = "jYYYY/jMM/jDD";

const BookingContinue = ({
  context,
  property,
}: {
  context: BookingActionsContext;
  property: PropertyDetailsView;
}) => {
  const { isLogin } = useAuthStore((state) => state);
  const [show, setShow] = useState(false);

  const onContinue = () => {
    if (isLogin) setShow(true);
    else useStoreParams.setState({ loginModal: true });
  };

  return (
    <>
      <Button
        onClick={onContinue}
        roundedClass="rounded-10"
        title={_STRINGS.ENTER_AND_MOVE_ON}
        width="w-full !py-2.5 !text-base"
        containerClass="w-full"
      />
      <ReserveRequestModal
        show={show}
        property={property}
        count={context.guests}
        onHide={() => setShow(false)}
        endDate={moment(context.endDate).format(JALALI_DATE)}
        startDate={moment(context.startDate).format(JALALI_DATE)}
        setShowEdit={() => {
          setShow(false);
          context.onEdit();
        }}
      />
    </>
  );
};

export default BookingContinue;
