"use client";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { HomeService } from "@/api_services/home/home.service";
import AdvisorCard from "@/components/Advisor/AdvisorCard";
import SingleAdvisorModal from "@/components/Advisor/SingleAdvisorModal";
import CityModal from "@/components/CityModal";
import BannersContainer from "@/components/Home/BannersContainer";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import Button from "@/components/shared/Button/Button";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import SimpleAccordion from "@/components/shared/SimpleAccorion";
import { useAuthStore, useStoreParams } from "@/store";
import { fakeConsultants } from "@/utils/faker";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { last } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const AdvisorsListPage = () => {
  const router = useRouter();
  const { isLogin } = useAuthStore((state) => state);
  const [showCityModal, setShowCiyModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
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

  const hideCityModal = () => {
    setShowCiyModal(false);
  };
  const showCityModalFunc = () => {
    setShowCiyModal(true);
  };

  const registerAdvisor = () => {
    if (isLogin) {
      router.push("/profile/advisor/subscription");
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };
  return (
    <div className=" w-full container flex flex-col">
      <BannersContainer />
      <div className=" w-full flex items-center justify-between">
        {" "}
        <Button
          width=" w-full md:w-fit"
          containerClass="w-full md:w-fit flex items-center justify-center"
          onClick={showCityModalFunc}
          title={_STRINGS.CHOOSE_STATE_AND_CITY}
        />
        <Button
          variant="outline"
          width=" w-full md:w-fit"
          containerClass="w-full md:w-fit flex items-center justify-center"
          onClick={registerAdvisor}
          title={_STRINGS.REGISTER_ADVISOR}
        />
      </div>
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
          className="grid px-1   pb-8 pt-4 !overflow-hidden  grid-cols-1 gap-2 md:gap-4  lg:grid-cols-2 2xl:grid-cols-3 "
        >
          {fakeConsultants?.map((i) => (
            <AdvisorCard
              callback={() => {
                setSelectedAdvisor(i);
              }}
              data={i}
              key={`PRODUCT${i?.id}`}
            />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="col-span-4">
          <EmptyList />
        </div>
      )}

      <CityModal show={showCityModal} onHide={hideCityModal} />
      <SingleAdvisorModal
        selectedAdvisor={selectedAdvisor}
        show={!!selectedAdvisor}
        onHide={() => {
          setSelectedAdvisor(null);
        }}
      />
    </div>
  );
};

export default AdvisorsListPage;
