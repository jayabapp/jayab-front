import LottieLoading from "../shared/Lotties/LottieLoading";
import EmptyList from "../shared/Lotties/EmptyList";
import PropertyCard from "../properties/PropertyCard";
import { isUndefined } from "lodash";

type SsrPartFilterType = {
  firstData: any;
};

function SsrPartFilter({ firstData }: SsrPartFilterType) {
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {/* <SortContainer query={query} /> */}

        {isUndefined(firstData) ? (
          <LottieLoading />
        ) : firstData?.length > 0 ? (
          <div className="grid   pb-2 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 ">
            {firstData?.map((i: any) => (
              <PropertyCard data={i} key={`PRODUCT${i?.id}`} />
            ))}
          </div>
        ) : (
          <div className="col-span-4">
            <EmptyList />
          </div>
        )}
      </div>
    </div>
  );
}

export default SsrPartFilter;
