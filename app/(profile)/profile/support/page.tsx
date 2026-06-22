"use client";

import _STRINGS from "@/utils/LocalStrings";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BtnLoading from "@/components/shared/Button/BtnLoading";
import InfiniteScroll from "react-infinite-scroll-component";

import { MetaDto, TicketDatum } from "@/api_services/support/support.interface";
import { SupportService } from "@/api_services/support/support.service";
import Button from "@/components/shared/Button/Button";
import EmptyList from "@/components/shared/Lotties/EmptyList";
import LottieLoading from "@/components/shared/Lotties/LottieLoading";
import SupportCard from "@/components/support/SupportCard";
import { useAuthStore } from "@/store";
import isEmpty from "lodash/isEmpty";

const Support = () => {
  const { isLogin } = useAuthStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<TicketDatum[]>([]);
  const [meta, setMeta] = useState<MetaDto>();

  const { data: solidData, isLoading } = useQuery({
    queryKey: [SupportService?.TICKETS_CACHEKEY, page, isLogin],
    queryFn: () => SupportService?.GetTickets({ page: page, type: "TICKET" }),
    gcTime: 0,
    staleTime: 0,
    enabled: !!isLogin,
  });

  useEffect(() => {
    if (!!solidData) {
      if (solidData?.data) setTickets((x) => [...x, ...solidData?.data]);
      if (solidData?.meta) setMeta(solidData?.meta);
    }
  }, [solidData]);

  /* -------------------------------------------------------------------------- */
  /*                                NOT LOGGED IN                               */
  /* -------------------------------------------------------------------------- */
  const goToLogin = () => {
    router.push("/auth?redirect_url=/profile/support");
  };
  return (
    <div id="homeParent" className=" profile-container flex flex-col gap-4   transition-all duration-500 ease-in-out ">
      {/* <Breadcrumbs /> */}
      {!!isLogin ? (
        <>
          {" "}
          {isLoading && isEmpty(tickets) ? (
            <LottieLoading />
          ) : tickets?.length == 0 ? (
            <EmptyList />
          ) : (
            <InfiniteScroll
              dataLength={tickets?.length} //This is important field to render the next data
              next={() => setPage((e) => e + 1)}
              hasMore={page !== meta?.lastPage ? true : false}
              className="grid  grid-cols-1 md:grid-cols-2  gap-4  p-4"
              loader={
                <div className="w-full mt-8   flex items-center justify-center md:p-4">
                  <BtnLoading />
                </div>
              }
            >
              {tickets?.map((e) => (
                <SupportCard item={e} key={`${e?.id}tickets`} />
              ))}
            </InfiniteScroll>
          )}
          <Button
            variant="outline"
            width="!font-bold !bg-white"
            containerClass="flex items-center  justify-center 2xl:justify-start"
            title={_STRINGS?.SEND_NEW_TICKET}
            onClick={() => {
              router?.push("/profile/support/new-ticket");
            }}
          />
        </>
      ) : (
        <div className="w-full flex flex-col items-center justify-center  gap-4">
          <h2 className="text-primary-700 ">{_STRINGS.HI}!</h2>
          <p className="text-sm">{_STRINGS.FOR_SUPPORT_LOGIN}</p>

          <Button
            containerClass="   mt-8 w-full"
            width="w-full"
            title={_STRINGS?.LOGIN_TO_UR_ACCOUNT}
            onClick={() => {
              goToLogin();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Support;
