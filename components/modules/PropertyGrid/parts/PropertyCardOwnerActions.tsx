import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { Divider } from "@elements/Divider";

import type { PropertyCardOwnerActionsProps } from "@/types/components/modules/property-grid";

import PropertyAuthorizationStatus from "../PropertyAuthorizationStatus.client";
import Button from "@elements/Button";
import Link from "next/link";

const PropertyCardOwnerActions = ({
  data,
  goToLink,
}: PropertyCardOwnerActionsProps) => {
  const t = useTranslations();

  return (
    <div className="w-full flex flex-col">
      <Divider moreClass="my-1" />
      <div className="w-full flex py-2 border-line items-center justify-between">
        <p className="text-xs">{t("listing.addDuration")} :</p>
        <div className="flex items-center gap-2">
          <div className="rounded-full text-sm text-link bg-selected flex items-center justify-center h-7 w-24">
            {data?.remaining_days
              ? `${t("listing.creditDays", { count: Number(data?.remaining_days) })}`
              : t("listing.noCredit")}
          </div>
          <Link
            prefetch={false}
            title={t("common.extendSubs")}
            href={`/profile/owner/properties/${data?.id}/subscription`}
            className="rounded-full !outline-none text-xs text-on-action bg-action flex items-center justify-center h-7 w-24"
          >
            {t("common.extendSubs")}
          </Link>
        </div>
      </div>

      <Divider moreClass="my-1" />
      <Link
        prefetch={false}
        title={t("listing.upgradeAddDesc")}
        href={`/profile/owner/properties/${data?.id}/subscription`}
        className="w-full !outline-none flex py-2 border-line items-center justify-between"
      >
        <p className="text-xs">{t("listing.upgradeAddDesc")}</p>
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
      <div className="w-full flex py-2 border-line items-center justify-between">
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
          title={t("listing.editPrices")}
          href={`/profile/owner/properties/${data?.id}/edit/price?edit_mode=true`}
          className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-action px-2 text-xs font-medium text-link !outline-none md:text-sm"
        >
          <ContentImage
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
            src="/assets/icons/property/price_label.svg"
          />
          <span>{t("listing.editPrices")}</span>
        </Link>
        <Link
          prefetch={false}
          title={t("listing.editCalendar")}
          href={`/profile/owner/properties/${data?.id}#owner-calendar`}
          className="flex min-h-10 items-center justify-center gap-2 rounded-full border border-action px-2 text-xs font-medium text-link !outline-none md:text-sm"
        >
          <ContentImage
            alt=""
            width={20}
            height={20}
            className="h-5 w-5"
            src="/assets/icons/reserve/blue_calendar_reserve.svg"
          />
          <span>{t("listing.editCalendar")}</span>
        </Link>
      </div>

      <Link
        prefetch={false}
        href={goToLink}
        className="w-full !outline-none"
        title={t("listing.propCardCDetails")}
      >
        <Button
          roundedClass="rounded-full"
          title={t("listing.propCardCDetails")}
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
};

export default PropertyCardOwnerActions;
