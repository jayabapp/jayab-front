"use client";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { HomeService } from "@/api_services/home/home.service";
import AdvisorCard from "@/components/Advisor/AdvisorCard";
import BannersContainer from "@/components/Home/BannersContainer";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import { fakeConsultants } from "@/utils/faker";
import { useQuery } from "@tanstack/react-query";
import { last } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const AdvisorsListPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [data, setData] = useState<any[]>([]);

  const { data: banners } = useQuery({
    queryKey: [HomeService.BANNERS_RANDOM_CACHEKEY, "MAIN"],
    queryFn: () => {
      HomeService.GetBanners({ position: "MAIN" });
    },
  });

  const {
    isLoading,
    refetch,
    data: propQueryData,
  } = useQuery({
    queryKey: [AdvisorService?.USER_ADVISORS_CACHEKEY],
    queryFn: () => {
      return AdvisorService?.userAdvisorsList({
        cursor: Number(cursor),
        per_page: 20,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData?.data) {
      if (Number(cursor) == 0 || cursor == 0) {
        setData(propQueryData?.data);
      } else setData((x) => [...x, ...propQueryData?.data]);
    }
  }, [propQueryData]);

  useEffect(() => {
    refetch();
  }, [cursor, refetcherBoolean]);
  return (
    <div className=" w-full container flex flex-col">
      <BannersContainer />

      {isLoading && data?.length == 0 ? (
        <LottieLoading />
      ) : data && data?.length > 0 ? (
        <InfiniteScroll
          dataLength={data?.length} //This is important field to render the next data
          next={() => {
            setCursor(last(data)?.id || 0);
          }}
          hasMore={data?.length % 20 == 0 ? true : false}
          loader={
            <div className="w-full mt-8 flex items-center justify-center">
              <BtnLoading />
            </div>
          }
          className="grid px-1   pb-8 pt-4 !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 xl:grid-cols-3 "
        >
          {fakeConsultants?.map((i) => (
            <AdvisorCard data={i} key={`PRODUCT${i?.id}`} />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="col-span-4">
          <EmptyList />
        </div>
      )}
    </div>
  );
};

export default AdvisorsListPage;
