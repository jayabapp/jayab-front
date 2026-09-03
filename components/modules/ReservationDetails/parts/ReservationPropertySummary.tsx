import { getPropertyImageUrl } from "@features/properties/mappers/property-image.mapper";
import type { ReservationViewProps } from "@/types/components/modules/reservations";
import { ContentImage } from "@elements/Image";
import { useStoreParams } from "@/store";

import _STRINGS from "@/utils/LocalStrings";
import Link from "next/link";

const IMAGE_PLACEHOLDER = "/assets/icons/shared/image_placeholder.svg";

const ReservationPropertySummary = ({
  isOwner,
  reservation,
}: ReservationViewProps) => {
  const property = reservation?.property;
  const href = `/rooms/${property?.slug}`;
  const clearReturnHome = () => useStoreParams.setState({ getBackHome: false });

  return (
    <div className="w-full grid grid-cols-8 gap-2">
      <Link
        href={href}
        title={property?.title}
        onClick={clearReturnHome}
        className={`col-span-6 !outline-none ${isOwner ? "order-2" : "order-1"} flex flex-col gap-1`}
      >
        <div className="flex items-start gap-2">
          <p className="text-sm text-right font-semibold">
            {_STRINGS.RESERVE_REQUEST_FOR} {property?.title}
          </p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <div className="flex w-full items-center gap-1">
            <p className="text-xs line-clamp-1 text-center">
              {property?.city?.title}{" "}
              <span className="text-xs">
                {property?.province?.title || property?.region?.title
                  ? `(${property?.region?.title || property?.province?.title})`
                  : ``}
              </span>
            </p>
          </div>
        </div>
      </Link>

      <Link
        href={href}
        title={property?.title}
        onClick={clearReturnHome}
        className={`flex h-fit !outline-none items-start justify-start w-full col-span-2 ${isOwner ? "order-1" : "order-2"}`}
      >
        <div className="aspect-square w-full h-full relative">
          <ContentImage
            fill
            quality={75}
            loading="lazy"
            sizes="(min-width: 1024px) 10vw, 25vw"
            alt={property?.feature_image?.alt || ""}
            className="w-full rounded-10 h-full object-cover aspect-square"
            src={
              property?.feature_image
                ? getPropertyImageUrl(property?.feature_image, "medium")
                : IMAGE_PLACEHOLDER
            }
          />
        </div>
      </Link>
    </div>
  );
};

export default ReservationPropertySummary;
