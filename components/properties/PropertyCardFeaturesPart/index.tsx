import { PropertyListDto } from "@/api_services/property/property.interface";
import _STRINGS from "@/utils/LocalStrings";

const TextIcon = ({ title, iconUrl, disabled }: { title: string; iconUrl: string; disabled?: boolean }) => {
  return (
    <div className={`flex items-center gap-1 justify-center ${disabled ? "grayscale opacity-80" : ""}`}>
      <div className="size-5 p-[1px] flex items-center justify-center">
        <img src={iconUrl} className="   w-full h-full " />
      </div>
      <p className="text-xs  ">{title}</p>
    </div>
  );
};

const PropertycardFeaturePart = ({ data }: { data: PropertyListDto }) => {
  return (
    <div className={`w-full flex   justify-start gap-4   items-center `}>
      <TextIcon title={`${data?.max_capacity} نفر`} iconUrl="/assets/icons/adds/max_cap_house.svg" />
      <TextIcon title={`${data?.total_bedrooms} اتاق`} iconUrl="/assets/icons/adds/prop_card_bed.svg" />
      <TextIcon
        disabled={!data?.has_pool}
        title={`${data?.has_pool ? _STRINGS.HAS_POOL : _STRINGS.POOL_LESS}`}
        iconUrl="/assets/icons/adds/prop_card_pool.svg"
      />
    </div>
  );
};

export default PropertycardFeaturePart;
