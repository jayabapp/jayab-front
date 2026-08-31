"use client";

import { useAdvisorBanners } from "@features/advisors/hooks/useAdvisorBanners";
import type { AdvisorPageListDto } from "@/types/components/modules/advisors";
import type { AdvisorListProps } from "@/types/components/modules/advisors";
import { AdvisorCard, AdvisorDetailsModal } from "@modules/AdvisorDetails";
import { useAuthStore, useStoreInit, useStoreParams } from "@/store";
import { useAdvisors } from "@features/advisors/hooks/useAdvisors";
import { AdvisorCardSkeleton } from "@modules/AdvisorDetails";
import { usePathname, useRouter } from "next/navigation";
import { BannerPosition } from "@/enum/banners.enum";
import { useMemo, useState } from "react";

import AdvisorRegisterCta from "./parts/AdvisorRegisterCta.client";
import AdvisorSearchBar from "./parts/AdvisorSearchBar.client";
import InfiniteScroll from "react-infinite-scroll-component";
import Breadcrumbs from "@/components/BreadCrumbs";
import queryBuilder from "@/helpers/queryBuilder";
import EmptyState from "@elements/EmptyState";
import useQueryGet from "@/helpers/queryGet";
import dynamic from "next/dynamic";

const HomeAdvisorSub = dynamic(() =>
  import("@modules/HomeAdvisor").then(
    (module) => module.HomeAdvisorSubscription,
  ),
);
const BannersContainer = dynamic(() =>
  import("@modules/HomeBanners").then((module) => module.HomeBanners),
);

const SKELETON_COUNT = 6;
const GRID_CLASS = "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3";

const AdvisorList = ({ devices }: AdvisorListProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useQueryGet<Record<string, string>>();
  const { userInfo } = useStoreInit((state) => state);
  const { isLogin } = useAuthStore((state) => state);

  const [selectedAdvisor, setSelectedAdvisor] =
    useState<AdvisorPageListDto | null>(null);
  const [cityTitle, setCityTitle] = useState("");

  const { data: banners } = useAdvisorBanners();
  const {
    advisors,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useAdvisors(
    useMemo(
      () => ({
        cities: query?.cities,
        province_id: query?.province_id,
        q: query?.search,
      }),
      [query?.search, query?.cities, query?.province_id],
    ),
  );

  const onFilter = (value: number | string, key: string) => {
    const next: Record<string, unknown> = { ...query };
    if (value) next[key] = value;
    else delete next[key];
    router.replace(`${pathname}?${queryBuilder(next)}`);
  };

  const requireLogin = (action: () => void) => {
    if (isLogin) action();
    else useStoreParams.setState({ loginModal: true });
  };

  return (
    <>
      <Breadcrumbs />

      <div className="w-full flex flex-col gap-4 md:gap-8">
        <BannersContainer
          devices={devices}
          banners={banners?.[BannerPosition.Advisor]}
        />

        <div className="w-full flex flex-col md:flex-row gap-4">
          <AdvisorSearchBar
            onFilter={onFilter}
            cityTitle={cityTitle}
            onCityTitleChange={setCityTitle}
          />
          <div className="w-full flex md:flex-wrap flex-col md:flex-row gap-2 md:gap-4 items-center md:justify-end">
            <AdvisorRegisterCta
              advisorId={userInfo?.advisor_id}
              isSpecialAdvisor={!!userInfo?.advisor?.is_special}
              onRegister={() =>
                requireLogin(() => router.push("/profile/advisor/subscription"))
              }
            />
          </div>
        </div>

        <HomeAdvisorSub />

        {isLoading && advisors.length === 0 ? (
          <div className={GRID_CLASS}>
            {Array.from({ length: SKELETON_COUNT }, (_, index) => (
              <AdvisorCardSkeleton key={index} />
            ))}
          </div>
        ) : advisors.length > 0 ? (
          <InfiniteScroll
            hasMore={hasNextPage}
            dataLength={advisors.length}
            className="grid px-1 pb-8 pt-4 !overflow-hidden grid-cols-1 gap-2 md:gap-4 md:grid-cols-2 2xl:grid-cols-3"
            next={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            loader={
              <div className={`col-span-full ${GRID_CLASS}`}>
                <AdvisorCardSkeleton />
                <AdvisorCardSkeleton />
                <AdvisorCardSkeleton />
              </div>
            }
          >
            {advisors.map((advisor) => (
              <AdvisorCard
                advisor={advisor}
                key={`advisor${advisor?.id}`}
                onSelect={() => requireLogin(() => setSelectedAdvisor(advisor))}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="col-span-4">
            <EmptyState />
          </div>
        )}

        <AdvisorDetailsModal
          show={!!selectedAdvisor}
          advisor={selectedAdvisor}
          onHide={() => setSelectedAdvisor(null)}
        />
      </div>
    </>
  );
};

export default AdvisorList;
