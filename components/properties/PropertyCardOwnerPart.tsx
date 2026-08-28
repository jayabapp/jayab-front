import { PropertyListDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";
import Button from "../shared/Button/Button";
import { Divider } from "../shared/Divider";
import AuthorizationStatus from "./AuthorizationStatus";

const PropertyCardOwnerPart = ({ data, goToLink }: { goToLink: string; data: PropertyListDto }) => {
  return (
    <div className="w-full flex flex-col ">
      <Divider moreClass="my-1" />
      <div className="w-full flex  py-2  border-neutral-200 items-center justify-between ">
        <p className="text-xs">{_STRINGS.ADD_DURATION} :</p>

        <div className=" flex items-center  gap-2">
          <div className=" rounded-full text-sm text-brand-600 bg-brand-200 flex  items-center justify-center h-7 w-24 ">
            {!data?.remaining_days ? "بدون اعتبار" : `${data?.remaining_days} روز اعتبار`}
          </div>
          <Link
            title={_STRINGS.EXTEND_SUBS}
            prefetch={false}
            href={`/profile/owner/properties/${data?.id}/subscription`}
            className=" rounded-full  !outline-none text-xs text-white bg-brand-600 flex  items-center justify-center h-7 w-24 "
          >
            {_STRINGS.EXTEND_SUBS}
          </Link>
        </div>
      </div>
      <Divider moreClass="my-1" />
      <Link
        href={`/profile/owner/properties/${data?.id}/subscription`}
        prefetch={false}
        title={_STRINGS.UPGRADE_ADD_DESC}
        className="w-full !outline-none flex  py-2  border-neutral-200 items-center justify-between "
      >
        <p className="text-xs">{_STRINGS.UPGRADE_ADD_DESC} </p>

        <div className=" flex items-center  gap-2">
          <img src="/assets/icons/shared/chevron-left.svg" />
        </div>
      </Link>
      <Divider moreClass="my-1" />
      <div className="w-full flex  py-2  border-neutral-200 items-center justify-between ">
        <div className="flex w-full items-start gap-1">
          <img src="/assets/icons/adds/pin_point_location.svg" className="w-5 h-5 aspect-square" />
          <p className="text-sm mt-0.5">
            {data?.province} {"-"} {data?.city} {data?.region ? ` - ${data?.region}` : ""}
          </p>
        </div>
        <Divider moreClass="my-1" />
        <AuthorizationStatus isAuthorized={data?.is_authorized} data={data} />
      </div>

      <Divider moreClass="my-1" />
      <div className="grid w-full grid-cols-2 gap-2 py-2">
        <Link
          title={_STRINGS.EDIT_PRICES}
          href={`/profile/owner/properties/${data?.id}/edit/price?edit_mode=true`}
          prefetch={false}
          className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-brand-600 px-2 text-xs font-medium text-brand-600 !outline-none md:text-sm"
        >
          <img className="h-5 w-5" src="/assets/icons/property/price_label.svg" alt="" />
          <span>{_STRINGS.EDIT_PRICES}</span>
        </Link>
        <Link
          title={_STRINGS.EDIT_CALENDAR}
          href={`/profile/owner/properties/${data?.id}#owner-calendar`}
          prefetch={false}
          className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-brand-600 px-2 text-xs font-medium text-brand-600 !outline-none md:text-sm"
        >
          <img className="h-5 w-5" src="/assets/icons/reserve/blue_calendar_reserve.svg" alt="" />
          <span>{_STRINGS.EDIT_CALENDAR}</span>
        </Link>
      </div>

      <Link title={_STRINGS.PROP_CARD_C_DETAILS} href={goToLink} className="w-full !outline-none " prefetch={false}>
        {" "}
        <Button
          title={_STRINGS.PROP_CARD_C_DETAILS}
          roundedClass="rounded-full"
          containerClass="w-full relative mt-2"
          width="w-full   !text-sm md:!text-base"
          icon={
            <img
              className="w-5 h-5 absolute left-4  top-0 bottom-0 my-auto"
              src="/assets/icons/property/white_arrow_left.svg"
            />
          }
        />
      </Link>
    </div>
  );
};

export default PropertyCardOwnerPart;
