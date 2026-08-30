import type { PropertyCardOwnerActionsProps } from "@/types/components/modules/property-grid";
import { ContentImage } from "@elements/Image";
import { Divider } from "@elements/Divider";

import PropertyAuthorizationStatus from "../PropertyAuthorizationStatus.client";
import _STRINGS from "@/utils/LocalStrings";
import Button from "@elements/Button";
import Link from "next/link";

const PropertyCardOwnerActions = ({
  data,
  goToLink,
}: PropertyCardOwnerActionsProps) => (
  <div className="w-full flex flex-col">
    <Divider moreClass="my-1" />
    <div className="w-full flex py-2 border-neutral-200 items-center justify-between">
      <p className="text-xs">{_STRINGS.ADD_DURATION} :</p>
      <div className="flex items-center gap-2">
        <div className="rounded-full text-sm text-brand-600 bg-brand-200 flex items-center justify-center h-7 w-24">
          {data?.remaining_days
            ? `${data?.remaining_days} ${_STRINGS.DAYS_CREDIT}`
            : _STRINGS.NO_CREDIT}
        </div>
        <Link
          prefetch={false}
          title={_STRINGS.EXTEND_SUBS}
          href={`/profile/owner/properties/${data?.id}/subscription`}
          className="rounded-full !outline-none text-xs text-white bg-brand-600 flex items-center justify-center h-7 w-24"
        >
          {_STRINGS.EXTEND_SUBS}
        </Link>
      </div>
    </div>

    <Divider moreClass="my-1" />
    <Link
      prefetch={false}
      title={_STRINGS.UPGRADE_ADD_DESC}
      href={`/profile/owner/properties/${data?.id}/subscription`}
      className="w-full !outline-none flex py-2 border-neutral-200 items-center justify-between"
    >
      <p className="text-xs">{_STRINGS.UPGRADE_ADD_DESC}</p>
      <div className="flex items-center gap-2">
        <ContentImage
          alt=""
          width={16}
          height={16}
          src="/assets/icons/shared/chevron-left.svg"
        />
      </div>
    </Link>

    <Divider moreClass="my-1" />
    <div className="w-full flex py-2 border-neutral-200 items-center justify-between">
      <div className="flex w-full items-start gap-1">
        <ContentImage
          alt=""
          width={20}
          height={20}
          className="w-5 h-5 aspect-square"
          src="/assets/icons/adds/pin_point_location.svg"
        />
        <p className="text-sm mt-0.5">
          {data?.province} {"-"} {data?.city}{" "}
          {data?.region ? ` - ${data?.region}` : ""}
        </p>
      </div>
      <Divider moreClass="my-1" />
      <PropertyAuthorizationStatus
        data={data}
        isAuthorized={data?.is_authorized}
      />
    </div>

    <Divider moreClass="my-1" />
    <div className="grid w-full grid-cols-2 gap-2 py-2">
      <Link
        prefetch={false}
        title={_STRINGS.EDIT_PRICES}
        href={`/profile/owner/properties/${data?.id}/edit/price?edit_mode=true`}
        className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-brand-600 px-2 text-xs font-medium text-brand-600 !outline-none md:text-sm"
      >
        <ContentImage
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          src="/assets/icons/property/price_label.svg"
        />
        <span>{_STRINGS.EDIT_PRICES}</span>
      </Link>
      <Link
        prefetch={false}
        title={_STRINGS.EDIT_CALENDAR}
        href={`/profile/owner/properties/${data?.id}#owner-calendar`}
        className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-brand-600 px-2 text-xs font-medium text-brand-600 !outline-none md:text-sm"
      >
        <ContentImage
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          src="/assets/icons/reserve/blue_calendar_reserve.svg"
        />
        <span>{_STRINGS.EDIT_CALENDAR}</span>
      </Link>
    </div>

    <Link
      prefetch={false}
      href={goToLink}
      className="w-full !outline-none"
      title={_STRINGS.PROP_CARD_C_DETAILS}
    >
      <Button
        roundedClass="rounded-full"
        title={_STRINGS.PROP_CARD_C_DETAILS}
        containerClass="w-full relative mt-2"
        width="w-full !text-sm md:!text-base"
        icon={
          <ContentImage
            alt=""
            width={20}
            height={20}
            className="w-5 h-5 absolute left-4 top-0 bottom-0 my-auto"
            src="/assets/icons/property/white_arrow_left.svg"
          />
        }
      />
    </Link>
  </div>
);

export default PropertyCardOwnerActions;
