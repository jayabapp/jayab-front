"use client";
import { AdvisorPageListDto } from "@/api_services/advisor/advisor.interface";
import { AdvisorService } from "@/api_services/advisor/advisor.propery";
import { HomeService } from "@/api_services/home/home.service";
import AdvisorCard from "@/components/Advisor/AdvisorCard";
import SingleAdvisorModal from "@/components/Advisor/SingleAdvisorModal";
import Breadcrumbs from "@/components/BreadCrumbs";
import CityModal from "@/components/CityModal";
import BtnLoading from "@/components/shared/Button/BtnLoading";
import Button from "@/components/shared/Button/Button";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import queryBuilder from "@/helpers/queryBuilder";
import useQueryGet from "@/helpers/queryGet";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import _STRINGS from "@/utils/LocalStrings";
import { useQuery } from "@tanstack/react-query";
import { last } from "lodash";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { BannerPosition } from "@/enum/banners.enum";
import { DeviceInfo } from "@/helpers/device.detector";
import dynamic from "next/dynamic";
const HomeAdvisorSub = dynamic(() => import("@/components/Home/HomeAdvisorSub"));

const BannersContainer = dynamic(() => import("@/components/Home/BannersContainer"));
const SearchBox = dynamic(() => import("@/components/SearchBoxComp"));
const AdvisorsPageHelper = ({ devices }: { devices: DeviceInfo }) => {
  const router = useRouter();
  const queriesParams = useQueryGet<any>();
  const pathname = usePathname();
  const { userInfo } = useStoreInit((data) => data);
  const { isLogin } = useAuthStore((state) => state);
  const [showCityModal, setShowCiyModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<any>(null);
  const [refetcherBoolean, setRefetcherBoolean] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [cityTitle, setCityTitle] = useState("");
  const [data, setData] = useState<AdvisorPageListDto[]>([]);
  const { data: banners } = useQuery({
    queryKey: [HomeService.BANNERS_RANDOM_CACHEKEY, BannerPosition.Advisor],
    queryFn: () => {
      return HomeService.GetBanners({ positions: [BannerPosition.Advisor] });
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                                GET ADVISORS     + FILTERS                           */
  /* -------------------------------------------------------------------------- */

  const {
    isLoading,
    refetch,
    data: propQueryData,
  } = useQuery({
    queryKey: [AdvisorService?.USER_ADVISORS_CACHEKEY, queriesParams?.cities, queriesParams.search],
    queryFn: () => {
      return AdvisorService?.userAdvisorsList({
        cursor: Number(cursor),
        per_page: 20,
        q: queriesParams.search,
        cities: !!queriesParams?.cities ? queriesParams?.cities : undefined,
        province_id: !!queriesParams?.province_id ? queriesParams?.province_id : undefined,
      });
    },
    gcTime: 0,
    staleTime: 0,
    enabled: false,
  });

  useEffect(() => {
    if (!!propQueryData) {
      if (cursor == 0) {
        setData(propQueryData);
      } else setData((x) => [...x, ...propQueryData]);
    }
  }, [propQueryData]);

  useEffect(() => {
    refetch();
  }, [cursor, refetcherBoolean]);

  useEffect(() => {
    setCursor(0);
    setData([]);
    setRefetcherBoolean(!refetcherBoolean);
  }, [queriesParams.search, queriesParams?.cities]);

  /////////////////////////

  const hideCityModal = () => {
    setShowCiyModal(false);
  };
  const showCityModalFunc = () => {
    setShowCiyModal(true);
  };

  /////////////////////////////

  const registerAdvisor = () => {
    if (isLogin) {
      router.push("/profile/advisor/subscription");
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  const onAdvisorCardClick = (e: any) => {
    if (isLogin) {
      setSelectedAdvisor(e);
    } else {
      useStoreParams.setState({ loginModal: true });
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                              SEARCH BOX FILTER                             */
  /* -------------------------------------------------------------------------- */

  const doTheFiltering = (e: string | number, key: string) => {
    let body: any = { ...queriesParams };
    if (e) {
      body[key] = e;
    } else {
      delete body[key];
    }
    router.replace(`${pathname}?${queryBuilder(body)}`);
  };

  return (
    <div className=" w-full container ">
      <Breadcrumbs />
      <div className="w-full flex flex-col gap-4 md:gap-8">
        <BannersContainer banners={banners?.[BannerPosition.Advisor]} devices={devices} />

        <div className="w-full flex flex-col  md:flex-row gap-4">
          <Suspense>
            <SearchBox
              passedQuerykey="search"
              boxId="ADVISOR_SEARCH"
              containerClass=" w-full"
              onClear={() => {
                doTheFiltering("", "search");
              }}
              onSubmit={(e) => {
                doTheFiltering(e || "", "search");
              }}
              placeholder="کد یا نام مشاور ..."
            >
              <div
                onClick={showCityModalFunc}
                className=" w-3/4 md:w-1/2  z-2    cursor-pointer  justify-end flex items-center gap-2"
              >
                <p className="text-3xl text-neutral-200">|</p>{" "}
                <p className="text-xs min-w-12  "> {!!cityTitle ? cityTitle.replace("جستجو در  ", "") : `شهر`}</p>
              </div>
            </SearchBox>
          </Suspense>
          <div className=" w-full flex   md:flex-wrap flex-col md:flex-row  gap-2 md:gap-4 items-center  md:justify-end ">
            {/* <Button
              roundedClass="rounded-full"
              width=" w-full md:w-fit"
              containerClass="w-full md:w-fit flex items-center justify-center  md:col-span-3"
              onClick={showCityModalFunc}
              title={cityTitle || _STRINGS.SELECT_CITY}
            /> */}
            {!userInfo?.advisor_id ? (
              <Button
                variant="outline"
                roundedClass="rounded-full"
                width=" w-full md:w-fit"
                containerClass="w-full  md:col-span-3 hidden md:flex  md:w-fit  items-center justify-center"
                onClick={registerAdvisor}
                title={_STRINGS.REGISTER_ADVISOR}
              />
            ) : userInfo?.advisor_id && !userInfo?.advisor?.is_special ? (
              <Link
                href={`/profile/advisor/subscription/is-especial`}
                className="w-full md:w-fit  px-12  md:col-span-4  rounded-full flex items-center justify-center gap-4 h-12 bg-primary-600 "
              >
                <img className="w-5 h-5 aspect-square" src="/assets/icons/home/white_star_tick.svg" />
                <p className="text-white">{_STRINGS.REGISTER_AS_SPECIAL_AD}</p>
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
        <HomeAdvisorSub />

        {isLoading && data?.length == 0 ? (
          <LottieLoading />
        ) : data && data?.length > 0 ? (
          <InfiniteScroll
            dataLength={data?.length} //This is important field to render the next data
            next={() => {
              setCursor(last(data)?.id || 0);
            }}
            hasMore={propQueryData?.length != 0 ? true : false}
            loader={
              <div className="w-full mt-8 flex items-center justify-center">
                <BtnLoading />
              </div>
            }
            className="grid px-1   pb-8 pt-4 !overflow-hidden  grid-cols-1 gap-2 md:gap-4  md:grid-cols-2 2xl:grid-cols-3 "
          >
            {data?.map((i) => (
              <AdvisorCard
                callback={() => {
                  onAdvisorCardClick(i);
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

        <CityModal setTitle={setCityTitle} show={showCityModal} onHide={hideCityModal} />
        <SingleAdvisorModal
          selectedAdvisor={selectedAdvisor}
          show={!!selectedAdvisor}
          onHide={() => {
            setSelectedAdvisor(null);
          }}
        />
      </div>
    </div>
  );
};

export default AdvisorsPageHelper;
