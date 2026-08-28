import { ChildCities, NewCitiesListDto } from "@/api_services/city/city.interface";

const SelectedRegions = ({
  selectedRegions,
  onRegionClick,
}: {
  selectedRegions: any[];
  onRegionClick: (item: NewCitiesListDto | ChildCities) => void;
}) => {
  return (
    <div className="  gap-2 w-full flex flex-wrap  min-h-8 transition-all">
      {selectedRegions?.map((e) => (
        <div
          key={`selectedItems${e?.id || e?.title}`}
          className="rounded-full gap-4 py-1 px-1 flex items-center justify-center border border-brand-600/30  bg-brand-600/5  text-xs "
        >
          <p className="text-sm text-neutral-900   pr-2">{e?.title} </p>
          <div
            onClick={() => {
              onRegionClick(e);
            }}
            className=" cursor-pointer w-4 h-4 aspect-square rounded-full border border-brand-600/30  flex items-center justify-center"
          >
            <img
              src="/assets/icons/adds/x_mark.svg"
              className="w-2.5 h-2.5    opacity-30 p-0.5  text-neutral-900 aspect-square "
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedRegions;
