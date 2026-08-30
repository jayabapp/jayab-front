"use client";

import { useVerifyPropertyPrompt } from "@features/owner-property/hooks/useVerifyPropertyPrompt";
import type { OwnerPropertyViewProps } from "@/types/components/modules/owner-property";
import { PropertyAuthorizationStatus } from "@modules/PropertyGrid";
import { PropertyPriceTag } from "@modules/PropertyDetails";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";

import ShareLink from "@/components/shared/shareComponent/BrowserShare";
import OwnerVerifyPromptModal from "./parts/OwnerVerifyPromptModal";
import StatusShower from "@/components/shared/StatusShower";
import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const OwnerPropertyIntroduction = ({ property }: OwnerPropertyViewProps) => {
  const router = useRouter();
  const prompt = useVerifyPropertyPrompt(property?.id, property?.is_authorized);

  const onVerifyConfirm = () => {
    prompt.accept();
    router.push(`/profile/owner/properties/${property?.id}/license`);
  };

  return (
    <div className="flex w-full flex-col relative gap-2">
      <div className="w-full flex items-start md:items-center justify-between gap-2">
        <p className="font-medium text-lg w-3/5 md:w-full md:text-2xl">
          {property?.title}
        </p>
        <PropertyAuthorizationStatus
          data={property}
          isAuthorized={property?.is_authorized}
        />
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-black/10 rounded-md text-base px-2 py-1 flex items-center justify-center">
            {_STRINGS.CODE} {property?.code}
          </div>
          <ShareLink
            passedHref={`${process.env.NEXT_PUBLIC_WEBSITE_URL}/rooms/${property?.code}`}
          />
        </div>
        {property?.is_promoted ? (
          <p className="font-bold text-brand-600 shrink-0 text-xs">
            {_STRINGS.LADDERED}
          </p>
        ) : null}
      </div>

      <div className="flex items-start gap-4 w-full">
        <div className="flex text-sm items-center gap-1">
          <p>{_STRINGS.TODAYS_PRICE}</p>
        </div>
        <PropertyPriceTag
          price={{
            discountedPrice: property?.today_price?.discounted_price,
            discountPercentage: property?.today_price?.discount_percentage,
            price: property?.today_price?.price,
          }}
        />
      </div>

      <div className="w-full flex flex-row items-center gap-2 justify-start">
        <p className="text-sm shrink-0">{_STRINGS.TODAY_STATUS} :</p>
        <p
          className={`text-sm font-bold ${property?.is_today_reserved ? "text-danger-500" : "text-brand-600"}`}
        >
          {property?.is_today_reserved ? _STRINGS.OCCUPIED : _STRINGS.EMPTY}
        </p>
      </div>

      <div className="flex w-full gap-1">
        <ContentImage
          alt=""
          width={20}
          height={20}
          className="w-5 h-5 aspect-square"
          src="/assets/icons/adds/pin_point_location.svg"
        />
        <p className="text-xs mt-1">
          {property?.province} - {property?.city}
          {property?.region ? ` - ${property?.region}` : ""}
        </p>
      </div>

      <div className="w-full flex py-2 border-neutral-200 items-center justify-between">
        <p className="text-xs">{_STRINGS.SUB_STATUS} :</p>
        <div className="flex items-center gap-2">
          <div className="rounded-full text-sm text-brand-600 bg-brand-200 flex items-center justify-center h-7 w-24">
            {property?.remaining_days
              ? `${property?.remaining_days} ${_STRINGS.DAYS_OF_CREDIT}`
              : _STRINGS.NO_REMAINING_CREDIT}
          </div>
          <Link
            prefetch={false}
            title={_STRINGS.EXTEND_SUBS}
            href={`/profile/owner/properties/${property?.id}/subscription`}
            className="rounded-full text-xs text-white bg-brand-600 flex items-center justify-center h-7 w-24"
          >
            {_STRINGS.EXTEND_SUBS}
          </Link>
        </div>
      </div>

      <StatusShower data={property?.status} />

      <OwnerVerifyPromptModal
        show={prompt.isOpen}
        onHide={prompt.dismiss}
        onConfirm={onVerifyConfirm}
      />
    </div>
  );
};

export default OwnerPropertyIntroduction;
