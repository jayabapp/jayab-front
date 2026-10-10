"use client";

import { useTranslations } from "next-intl";
import { ContentImage } from "@elements/Image";
import { useRouter } from "next/navigation";

import type { PropertyAuthorizationStatusProps } from "@/types/components/modules/property-grid";


const PropertyAuthorizationStatus = ({
  data,
  isAuthorized,
}: PropertyAuthorizationStatusProps) => {
  const t = useTranslations("listing");

  const router = useRouter();
  const canOpenLicense = Boolean(data?.id) && !isAuthorized;

  return (
    <button
      type="button"
      disabled={!canOpenLicense}
      onClick={() =>
        router.push(`/profile/owner/properties/${data?.id}/license`)
      }
      className={`bg-black/5 pl-2 pr-1 py-1 shrink-0 flex items-center rounded-full gap-2 ${
        isAuthorized ? "" : "custome-shadow-card"
      }`}
    >
      <ContentImage
        width={16}
        height={16}
        alt=""
        className="rounded-full w-4 h-4"
        src={
          isAuthorized
            ? "/assets/icons/property/green_circled_tick.svg"
            : "/assets/icons/property/red_exclmation.svg"
        }
      />
      <span
        className={`${isAuthorized ? "" : "text-status-danger"} shrink-0 text-xs`}
      >
        {isAuthorized ? t("verified") : t("notVerified")}
      </span>
    </button>
  );
};

export default PropertyAuthorizationStatus;
