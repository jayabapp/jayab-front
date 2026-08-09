import { useEffect, useState } from "react";
import { PropertyService } from "@/api_services/property/property.service";
import { PropertyListDto } from "@/api_services/property/property.interface";
import { weekFromToday } from "@/helpers/weekFromToday";
import { useQuery } from "@tanstack/react-query";

import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import InfiniteScroll from "react-infinite-scroll-component";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import PropertyCard from "@/components/properties/PropertyCard";
import EmptyList from "@/components/shared/Lotties/EmptyList";

export interface catQueryTypes {
  code: string | null | undefined;
}

type HomePropertiesClientPartType = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

function HomePropertiesClientPart({
  setPage,
  page,
}: HomePropertiesClientPartType) {
  const [week, setWeek] = useState<any[]>([]);
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);

  const [data, setData] = useState<PropertyListDto[]>([]);

  useEffect(() => {
    setWeek(weekFromToday());
  }, []);

  const {
    isLoading,
    refetch,
    data: propQueryData,
  } = useQuery({
    queryKey: [PropertyService?.GET_PROPERTIES_CACHEKEY, page],
    queryFn: () => {
      return PropertyService?.GetProperties({
        page: Number(page || 2),
        per_page: 30,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData?.data) {
      if (Number(page) == 1 || page == 1) setData([]);
      else setData((x) => [...x, ...propQueryData?.data]);
    }
  }, [propQueryData]);

  useEffect(() => {
    if (page != 1) refetch();
  }, [page, refetcherBoolean]);

  return (
    <div className="w-full px-0  self-center">
      {page != 1 ? (
        <div className=" w-full">
          {isLoading && data?.length == 0 ? (
            <LottieLoading />
          ) : data && data?.length > 0 ? (
            <InfiniteScroll
              scrollThreshold={0.5}
              dataLength={data?.length}
              next={() => {
                setPage(propQueryData?.meta?.next || 1);
              }}
              hasMore={data?.length % 30 == 0 ? true : false}
              loader={
                <div className="w-full mt-8 flex items-center justify-center">
                  <BtnLoading />
                </div>
              }
              className="grid   pb-8 pt-4 md:pt-2 px-1  !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-4 "
            >
              {data?.map((i) => (
                <PropertyCard week={week} data={i} key={`PRODUCT${i?.id}`} />
              ))}
            </InfiniteScroll>
          ) : (
            <div className="col-span-4">
              <EmptyList />
            </div>
          )}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default HomePropertiesClientPart;
