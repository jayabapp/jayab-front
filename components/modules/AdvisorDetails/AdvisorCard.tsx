import { getAdvisorAvatarUrl } from "@features/advisors/mappers/advisor-image.mapper";
import type { AdvisorCardProps } from "@/types/components/modules/advisors";
import { ContentImage } from "@elements/Image";
import { colors } from "@/theme/colors";

import AdvisorGauge from "./parts/AdvisorGauge";
import _STRINGS from "@/utils/LocalStrings";
import timeLeft from "@/helpers/timeLeft";

const LIST_CITY_LIMIT = 4;

const AdvisorCard = ({ advisor, onSelect, isSingle }: AdvisorCardProps) => {
  const allCities = advisor?.cities ?? [];
  const cities = isSingle ? allCities : allCities.slice(0, LIST_CITY_LIMIT);

  return (
    <div
      onClick={onSelect}
      className="rounded-2xl gap-2 shadow-card p-4 w-full flex cursor-pointer flex-col items-center"
    >
      <div className="w-full flex items-center gap-2">
        <div className="flex flex-col gap-2 h-full justify-between w-1/4 lg:w-1/5 2xl:w-1/4">
          <div className="relative w-full aspect-square">
            <ContentImage
              fill
              sizes="(max-width: 768px) 25vw, 120px"
              className="rounded-full object-cover"
              src={getAdvisorAvatarUrl(advisor?.user?.profile_image)}
              alt={
                advisor?.user?.profile_image?.alt ||
                advisor?.user?.full_name ||
                _STRINGS.ADVISOR_IMAGE
              }
            />
          </div>
          <div className="shrink-0 text-xs md:text-xs flex items-center justify-center px-1 md:px-2 py-1 rounded-md bg-brand-600 text-white">
            {_STRINGS.CODE} {advisor?.user?.referral_code}
          </div>
        </div>

        <div className="w-3/4 lg:w-4/5 2xl:w-3/4 flex flex-col gap-2 h-full justify-between shrink-0">
          <p className="font-medium text-sm md:text-base">
            {advisor?.user?.full_name}
          </p>
          <div className="w-full flex md:flex-cow items-center justify-between gap-2">
            <AdvisorGauge
              textSize="2rem"
              containerClass=" w-[35%]"
              labelClass="text-brand-600"
              pathColor={colors.brand[500]}
              textColor={colors.brand[500]}
              label={_STRINGS.USERS_SATISFACTION}
              value={advisor?.users_satisfaction || 100}
            />
            <AdvisorGauge
              textSize="2rem"
              containerClass=" w-[35%]"
              pathColor={colors.success[500]}
              textColor={colors.success[500]}
              labelClass="text-success-600"
              label={_STRINGS.OWNERS_SATISFACTION}
              value={advisor?.owners_satisfaction || 100}
            />
          </div>
          <p className="text-sm">
            {_STRINGS.XP} : {timeLeft(advisor?.created_at).replace("پیش", "")}
          </p>
        </div>
      </div>

      <div
        className={`flex ${isSingle ? "" : "line-clamp-1"} text-sm items-start gap-2 w-full`}
      >
        <p className="shrink-0">{_STRINGS.ACTIVITY_FIELD} :</p>
        <div
          className={`flex gap-1 flex-wrap ${isSingle ? "" : "line-clamp-1"} items-center`}
        >
          {cities.map((city, index) => (
            <p key={`${advisor?.id}${city}${index}`} className="text-xs">
              {`${index != 0 ? "," : ""}${city}`}{" "}
            </p>
          ))}
          {!isSingle && cities.length < allCities.length ? "..." : ""}
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;
