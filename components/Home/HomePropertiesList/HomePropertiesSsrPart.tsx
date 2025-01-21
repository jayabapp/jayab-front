import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";

type HomePropertiesSsrPartType = {
  data: any;
};

function HomePropertiesSsrPart({ data }: HomePropertiesSsrPartType) {
  return (
    <div className="w-full px-0  self-center">
      <div className=" w-full">
        {/* <SortContainer query={query} /> */}

        {!data ? (
          <LottieLoading />
        ) : data?.length > 0 ? (
          <div className="grid   pb-8 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 ">
            {data?.map((i: any) => (
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

export default HomePropertiesSsrPart;
